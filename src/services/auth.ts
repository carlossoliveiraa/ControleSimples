import { supabase } from '../lib/supabase';
import type { Usuario } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
            avatar_url: null,
            status: 'offline',
          },
        },
      });

      if (error) throw error;

      // Se o cadastro foi bem sucedido, criar o perfil do usuário
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              nome: nome,
              status: 'offline',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error instanceof AuthError) {
        throw new Error(this.tratarErroAuth(error.message));
      }
      throw new Error('Ocorreu um erro ao criar a conta. Tente novamente.');
    }
  },

  async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof AuthError) {
        throw new Error(this.tratarErroAuth(error.message));
      }
      throw new Error('Ocorreu um erro ao fazer login. Tente novamente.');
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Ocorreu um erro ao fazer logout. Tente novamente.');
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
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
  },

  tratarErroAuth(message: string): string {
    const erros: { [key: string]: string } = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Por favor, verifique sua caixa de entrada',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
      'Email rate limit exceeded': 'Muitas tentativas. Tente novamente mais tarde',
      'Password is too weak': 'A senha é muito fraca. Use uma combinação de letras, números e símbolos',
      'Email already taken': 'Este email já está em uso',
    };

    return erros[message] || 'Ocorreu um erro na autenticação. Tente novamente.';
  }
}; 