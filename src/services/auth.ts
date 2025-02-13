import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
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
      console.log('Iniciando cadastro:', { email, nome });

      // Primeiro, criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar usuário');
      }

      console.log('Usuário criado na auth:', authData.user);

      // Depois, criar o registro na tabela de usuários
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            email: email,
            nome: nome,
            status: 'offline',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            configuracoes: {
              notificacoes: true,
              tema: 'light',
              idioma: 'pt-BR'
            }
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('Erro ao criar perfil:', userError);
        // Tentar reverter a criação do usuário na auth
        await supabase.auth.signOut();
        throw new Error('Erro ao criar perfil do usuário');
      }

      console.log('Perfil criado com sucesso:', userData);

      return { 
        user: authData.user, 
        error: null,
        confirmEmail: authData.user.confirmation_sent_at !== null 
      };

    } catch (error) {
      console.error('Erro completo no cadastro:', error);
      if (error instanceof AuthError) {
        throw new Error(this.tratarErroAuth(error.message));
      }
      throw error;
    }
  },

  tratarErroAuth(message: string): string {
    const erros: { [key: string]: string } = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Por favor, verifique sua caixa de entrada',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
    };

    return erros[message] || 'Ocorreu um erro na autenticação';
  },

  async signIn({ email, password }: SignInData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Atualizar status e último acesso
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            status: 'online',
            ultimo_acesso: new Date().toISOString(),
          })
          .eq('id', authData.user.id);

        if (updateError) throw updateError;
      }

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao sair:', error);
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        const { data: userData, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        return { user: userData as Usuario, error: null };
      }

      return { user: null, error: null };
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return { user: null, error };
    }
  }
}; 