import { supabase } from '../lib/supabase';
import type { Usuario } from '../lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  nome: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  async signUp({ email, password, nome }: SignUpData) {
    try {
      // Verificar se o email já existe na tabela usuarios
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Este email já está cadastrado. Por favor, faça login ou use outro email.');
      }

      // Primeiro registrar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          }
        }
      });

      if (authError) {
        // Se o erro for de email duplicado na autenticação
        if (authError.message?.includes('duplicate')) {
          throw new Error('Este email já está cadastrado. Por favor, faça login ou use outro email.');
        }
        throw authError;
      }

      if (authData.user) {
        // Depois criar o registro na tabela de usuários
        const { data: userData, error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            email,
            nome,
            status: 'offline',
            configuracoes: {
              notificacoes: true,
              tema: 'light',
              idioma: 'pt-BR'
            }
          })
          .select()
          .single();

        if (profileError) {
          // Se houver erro ao criar o perfil, remover o usuário da autenticação
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }
      }

      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { 
        user: null, 
        error: new Error(error.message || 'Erro ao criar perfil do usuário. Por favor, tente novamente.')
      };
    }
  },

  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.session || !data.user) {
        throw new Error('Erro ao fazer login. Tente novamente.');
      }

      // Atualizar status do usuário para online
      await supabase
        .from('usuarios')
        .update({ 
          status: 'online',
          ultimo_acesso: new Date().toISOString()
        })
        .eq('id', data.user.id);

      return { session: data.session, user: data.user };
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return { user: null, error: authError };
      }

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        return { user: null, error: userError };
      }

      // Atualizar último acesso silenciosamente
      await supabase
        .from('usuarios')
        .update({ 
          ultimo_acesso: new Date().toISOString() 
        })
        .eq('id', user.id)
        .then(() => {
          // sucesso
        })
        .catch((error: Error) => {
          console.error('Erro ao atualizar último acesso:', error);
        });

      return { user: userData, error: null };
    } catch (error: any) {
      console.error('Erro ao obter usuário:', error);
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  },

  async updateAvatar(userId: string, file: File) {
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Gerar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Deletar avatar antigo se existir
      const { data: userData } = await supabase
        .from('usuarios')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (userData?.avatar_url) {
        const oldPath = userData.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Atualizar a URL do avatar no perfil do usuário
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { publicUrl, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error);
      return { 
        publicUrl: null, 
        error: new Error(error.message || 'Erro ao atualizar avatar. Por favor, tente novamente.')
      };
    }
  },

  async updateUserName(userId: string, newName: string) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({ nome: newName })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { user: data as Usuario, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      return { 
        user: null, 
        error: new Error(error.message || 'Erro ao atualizar nome. Por favor, tente novamente.')
      };
    }
  },

  async removeAvatar(userId: string) {
    try {
      // Buscar URL atual do avatar
      const { data: userData } = await supabase
        .from('usuarios')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      // Se tiver avatar, deletar do storage
      if (userData?.avatar_url) {
        const oldPath = userData.avatar_url.split('/').pop();
        if (oldPath) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`]);

          if (deleteError) throw deleteError;
        }
      }

      // Atualizar o perfil removendo a URL do avatar
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { error: null };
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      return { 
        error: new Error(error.message || 'Erro ao remover foto de perfil. Por favor, tente novamente.')
      };
    }
  },

  async updateProfile(userId: string, data: {
    nome: string;
    telefone?: string;
    descricao?: string;
    data_nascimento?: string;
    configuracoes?: {
      idioma: string;
    };
  }) {
    try {
      // Remover campos undefined/null antes de enviar
      const dadosLimpos = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );

      const { error } = await supabase
        .from('usuarios')
        .update(dadosLimpos)
        .eq('id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        error: new Error(error.message || 'Erro ao atualizar perfil. Por favor, tente novamente.')
      };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }
  },

  // Configurar headers de segurança
  async setSecurityHeaders() {
    if (typeof window !== 'undefined') {
      document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')?.remove();
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = `
        default-src 'self';
        img-src 'self' data: https: blob:;
        style-src 'self' 'unsafe-inline';
        script-src 'self' 'unsafe-inline';
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-src 'self' https://*.supabase.co;
        font-src 'self' data:;
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(meta);
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw new Error(error.message || 'Erro ao enviar email de recuperação');
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(error.message || 'Erro ao atualizar senha');
    }
  }
}; 