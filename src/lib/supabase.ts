import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

console.log('Variáveis de ambiente:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + '...' // Mostra apenas o início da chave por segurança
});

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está definida');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está definida');
}

// Validar se a URL é válida
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('VITE_SUPABASE_URL não é uma URL válida');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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