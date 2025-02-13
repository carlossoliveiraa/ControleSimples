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