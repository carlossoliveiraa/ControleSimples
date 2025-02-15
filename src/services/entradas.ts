import { supabase } from './supabase';
import type { Produto } from '../types';

export interface EntradaProduto {
  id: string;
  data: string;
  produto: {
    id: string;
    nome: string;
    sku: string;
  };
  quantidade: number;
  valor_unitario: number;
  documento: string | null;
  status: 'pendente' | 'concluido' | 'cancelado';
  observacoes?: string;
}

export const entradasService = {
  async buscarProdutos(termo: string) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          sku,
          preco_venda,
          categoria:categorias(nome)
        `)
        .or(`nome.ilike.%${termo}%,sku.ilike.%${termo}%`)
        .eq('ativo', true)
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  async listarEntradas() {
    try {
      // Primeiro buscar as movimentações do tipo entrada
      const { data: movimentacoes, error: movError } = await supabase
        .from('movimentacoes')
        .select(`
          id,
          data,
          tipo,
          documento,
          status,
          observacoes
        `)
        .eq('tipo', 'entrada')
        .order('data', { ascending: false });

      if (movError) throw movError;

      // Para cada movimentação, buscar seus itens e produtos
      const entradasCompletas = await Promise.all(movimentacoes.map(async (mov) => {
        // Buscar itens da movimentação
        const { data: itens } = await supabase
          .from('movimentacao_itens')
          .select(`
            quantidade,
            valor_unitario,
            subtotal,
            produto_id,
            lote,
            data_validade
          `)
          .eq('movimentacao_id', mov.id);

        if (!itens?.[0]) return null;

        // Buscar produto do primeiro item
        const { data: produto } = await supabase
          .from('produtos')
          .select('id, nome, sku')
          .eq('id', itens[0].produto_id)
          .single();

        return {
          id: mov.id,
          data: mov.data,
          produto: produto,
          quantidade: Number(itens[0].quantidade), // Convertendo para número pois vem como string do banco
          valor_unitario: Number(itens[0].valor_unitario), // Convertendo para número
          documento: mov.documento,
          status: mov.status,
          observacoes: mov.observacoes
        };
      }));

      // Filtrar possíveis nulos e retornar
      return entradasCompletas.filter(Boolean) as EntradaProduto[];
    } catch (error) {
      console.error('Erro ao listar entradas:', error);
      throw error;
    }
  },

  async salvarEntrada(entrada: Omit<EntradaProduto, 'id'>) {
    try {
      // Primeiro criar a movimentação
      const { data: movimentacao, error: movError } = await supabase
        .from('movimentacoes')
        .insert([{
          tipo: 'entrada',
          data: entrada.data,
          documento: entrada.documento,
          status: entrada.status,
          observacoes: entrada.observacoes
        }])
        .select()
        .single();

      if (movError) throw movError;

      // Depois criar o item da movimentação
      const { data: item, error: itemError } = await supabase
        .from('movimentacao_itens')
        .insert([{
          movimentacao_id: movimentacao.id,
          produto_id: entrada.produto.id,
          quantidade: entrada.quantidade,
          valor_unitario: entrada.valor_unitario,
          subtotal: entrada.quantidade * entrada.valor_unitario
        }])
        .select()
        .single();

      if (itemError) throw itemError;

      return { ...movimentacao, item };
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      throw error;
    }
  },

  async deletarEntrada(id: string) {
    try {
      // Primeiro deletar os itens da movimentação
      const { error: itemError } = await supabase
        .from('movimentacao_itens')
        .delete()
        .eq('movimentacao_id', id);

      if (itemError) throw itemError;

      // Depois deletar a movimentação
      const { error: movError } = await supabase
        .from('movimentacoes')
        .delete()
        .eq('id', id);

      if (movError) throw movError;

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
      throw error;
    }
  },

  async listarSaidas() {
    try {
      // Primeiro buscar as movimentações do tipo saída
      const { data: movimentacoes, error: movError } = await supabase
        .from('movimentacoes')
        .select(`
          id,
          data,
          tipo,
          documento,
          status,
          observacoes
        `)
        .eq('tipo', 'saida')
        .order('data', { ascending: false });

      if (movError) throw movError;

      // Para cada movimentação, buscar seus itens e produtos
      const saidasCompletas = await Promise.all(movimentacoes.map(async (mov) => {
        // Buscar itens da movimentação
        const { data: itens } = await supabase
          .from('movimentacao_itens')
          .select(`
            quantidade,
            valor_unitario,
            subtotal,
            produto_id,
            lote,
            data_validade
          `)
          .eq('movimentacao_id', mov.id);

        if (!itens?.[0]) return null;

        // Buscar produto do primeiro item
        const { data: produto } = await supabase
          .from('produtos')
          .select('id, nome, sku')
          .eq('id', itens[0].produto_id)
          .single();

        return {
          id: mov.id,
          data: mov.data,
          produto: produto,
          quantidade: Number(itens[0].quantidade),
          valor_unitario: Number(itens[0].valor_unitario),
          documento: mov.documento,
          status: mov.status,
          observacoes: mov.observacoes
        };
      }));

      // Filtrar possíveis nulos e retornar
      return saidasCompletas.filter(Boolean) as EntradaProduto[];
    } catch (error) {
      console.error('Erro ao listar saídas:', error);
      throw error;
    }
  },

  async salvarSaida(saida: {
    data: string;
    produtos: Array<{
      id: string;
      nome: string;
      sku: string;
      quantidade: number;
      valor_unitario: number;
    }>;
    documento: string | null;
    status: 'pendente' | 'concluido' | 'cancelado';
    observacoes: string | null;
  }) {
    try {
      // Primeiro criar a movimentação
      const { data: movimentacao, error: movError } = await supabase
        .from('movimentacoes')
        .insert([{
          tipo: 'saida',
          data: saida.data,
          documento: saida.documento,
          status: saida.status,
          observacoes: saida.observacoes
        }])
        .select()
        .single();

      if (movError) throw movError;

      // Depois criar os itens da movimentação
      const itensPromises = saida.produtos.map(produto => 
        supabase
          .from('movimentacao_itens')
          .insert([{
            movimentacao_id: movimentacao.id,
            produto_id: produto.id,
            quantidade: produto.quantidade,
            valor_unitario: produto.valor_unitario,
            subtotal: produto.quantidade * produto.valor_unitario
          }])
          .select()
      );

      await Promise.all(itensPromises);

      return movimentacao;
    } catch (error) {
      console.error('Erro ao salvar saída:', error);
      throw error;
    }
  }
}; 