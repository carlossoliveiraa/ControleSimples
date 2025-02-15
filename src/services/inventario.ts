import { supabase } from './supabase';

interface MovimentacaoData {
  tipo: string;
  data: string;
  status: string;
}

interface MovimentacaoItem {
  quantidade: number;
  valor_unitario: number;
  movimentacao: MovimentacaoData;
}

export interface ProdutoEstoque {
  id: string;
  nome: string;
  sku: string;
  quantidade_atual: number;
  quantidade_minima: number;
  valor_medio: number;
  valor_total: number;
  ultima_entrada: string | null;
  ultima_saida: string | null;
  status: 'normal' | 'baixo' | 'critico';
}

export const inventarioService = {
  async listarEstoque(): Promise<ProdutoEstoque[]> {
    try {
      const { data: produtos, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true);

      if (produtosError) throw produtosError;
      if (!produtos) return [];

      const estoque = await Promise.all(produtos.map(async (produto) => {
        const { data: movimentacoes, error: movError } = await supabase
          .from('movimentacao_itens')
          .select(`
            quantidade,
            valor_unitario,
            movimentacao:movimentacoes(
              tipo,
              data,
              status
            )
          `)
          .eq('produto_id', produto.id);

        if (movError) {
          console.error('Erro ao buscar movimentações:', movError);
          return null;
        }

        let quantidade_atual = 0;
        let valor_total = 0;
        let ultima_entrada: string | null = null;
        let ultima_saida: string | null = null;

        movimentacoes?.forEach((mov: any) => {
          if (mov.movimentacao?.status === 'concluido') {
            if (mov.movimentacao.tipo === 'entrada') {
              quantidade_atual += Number(mov.quantidade);
              valor_total += Number(mov.quantidade) * Number(mov.valor_unitario);
              if (!ultima_entrada) ultima_entrada = mov.movimentacao.data;
            } else if (mov.movimentacao.tipo === 'saida') {
              quantidade_atual -= Number(mov.quantidade);
              if (!ultima_saida) ultima_saida = mov.movimentacao.data;
            }
          }
        });

        const valor_medio = quantidade_atual > 0 ? valor_total / quantidade_atual : 0;
        let status: ProdutoEstoque['status'] = 'normal';
        const quantidade_minima = produto.quantidade_minima || 0;

        if (quantidade_atual <= 0) {
          status = 'critico';
        } else if (quantidade_atual <= quantidade_minima) {
          status = 'baixo';
        }

        return {
          id: produto.id,
          nome: produto.nome,
          sku: produto.sku,
          quantidade_atual,
          quantidade_minima,
          valor_medio,
          valor_total,
          ultima_entrada,
          ultima_saida,
          status
        };
      }));

      return estoque.filter((item): item is ProdutoEstoque => item !== null);
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      throw error;
    }
  },

  async ajustarEstoque(produtoId: string, novaQuantidade: number) {
    try {
      const estoque = await this.listarEstoque();
      const produto = estoque.find(p => p.id === produtoId);
      
      if (!produto) throw new Error('Produto não encontrado');

      const diferenca = novaQuantidade - produto.quantidade_atual;
      
      if (diferenca === 0) return true; // Não precisa ajustar se a quantidade é a mesma

      // Criar movimentação de ajuste
      const { data: movimentacao, error: movError } = await supabase
        .from('movimentacoes')
        .insert([{
          tipo: diferenca >= 0 ? 'entrada' : 'saida',
          data: new Date().toISOString(),
          documento: 'Ajuste de Estoque',
          status: 'concluido',
          observacoes: `Ajuste manual de estoque de ${produto.quantidade_atual} para ${novaQuantidade}`
        }])
        .select()
        .single();

      if (movError) throw movError;
      if (!movimentacao) throw new Error('Erro ao criar movimentação');

      // Criar item da movimentação
      const { error: itemError } = await supabase
        .from('movimentacao_itens')
        .insert([{
          movimentacao_id: movimentacao.id,
          produto_id: produtoId,
          quantidade: Math.abs(diferenca),
          valor_unitario: produto.valor_medio || 0,
          subtotal: Math.abs(diferenca) * (produto.valor_medio || 0)
        }]);

      if (itemError) throw itemError;

      return true;
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      throw error;
    }
  }
}; 