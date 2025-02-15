import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

// Configurações de segurança do cliente
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Tipos para as tabelas do Supabase
export type Usuario = {
  id: string;
  email: string;
  nome: string;
  avatar_url: string | null;
  status: 'online' | 'offline';
  ultimo_acesso: string | null;
  created_at: string;
  updated_at: string;
  username: string | null;
  bio: string | null;
  telefone: string | null;
  configuracoes: {
    notificacoes: boolean;
    tema: 'light' | 'dark';
    idioma: string;
  } | null;
} 