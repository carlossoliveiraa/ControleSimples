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

export interface Fornecedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  site: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FornecedorFormData {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  site: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  observacoes?: string;
  ativo: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  ativa: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CategoriaFormData = Omit<Categoria, 'id' | 'created_at' | 'updated_at'>;

export interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  avatar_url: string | null;
  sku: string;
  codigo_barras: string | null;
  categoria_id: string;
  categoria?: Categoria;
  preco_venda: number;
  preco_promocional: number | null;
  custo: number | null;
  peso: number | null;
  comprimento: number | null;
  largura: number | null;
  altura: number | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProdutoFormData {
  nome: string;
  descricao?: string;
  avatar_url?: string | null;
  sku: string;
  codigo_barras?: string;
  categoria_id: string;
  preco_venda: number;
  preco_promocional?: number;
  custo?: number;
  peso?: number;
  comprimento?: number;
  largura?: number;
  altura?: number;
  ativo: boolean;
} 