export interface Usuario {
  id: string;
  email: string;
  nome: string;
  avatar_url: string | null;
  status: 'online' | 'offline';
  ultimo_acesso: string | null;
  telefone: string | null;
  descricao: string | null;
  data_nascimento: string | null;
  configuracoes: {
    idioma: string;
  };
}

export interface Conversa {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  avatar: string;
  naoLidas?: number;
  pinned?: boolean;
}

export interface Mensagem {
  id: string;
  texto: string;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem';
  conteudo?: string;
  reacoes?: Array<{
    emoji: string;
    quantidade: number;
  }>;
}

export interface Cliente {
  id: string;
  avatar_url: string | null;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  sexo: 'M' | 'F';
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteFormData {
  avatar_url?: string | null;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_nascimento: string;
  sexo: 'M' | 'F';
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes?: string;
  ativo: boolean;
} 