import { supabase } from './supabase';

export interface TransacaoResumo {
  entradas: {
    quantidade: number;
    valor: number;
  };
  saidas: {
    quantidade: number;
    valor: number;
  };
  inventario: {
    quantidade: number;
    valor: number;
  };
}

export const transacoesService = {
  async obterResumo(): Promise<TransacaoResumo> {
    try {
      // Buscar todas as movimentações concluídas com seus itens
      const { data: movimentacoes, error: movError } = await supabase
        .from('movimentacoes')
        .select(`
          id,
          tipo,
          status,
          itens:movimentacao_itens(
            quantidade,
            valor_unitario,
            subtotal
          )
        `)
        .eq('status', 'concluido');

      if (movError) throw movError;

      let entradas = { quantidade: 0, valor: 0 };
      let saidas = { quantidade: 0, valor: 0 };

      // Calcular totais de entradas e saídas
      movimentacoes?.forEach((mov) => {
        if (mov.tipo === 'entrada') {
          mov.itens?.forEach(item => {
            entradas.quantidade += Number(item.quantidade);
            entradas.valor += Number(item.subtotal);
          });
        } else if (mov.tipo === 'saida') {
          mov.itens?.forEach(item => {
            saidas.quantidade += Number(item.quantidade);
            saidas.valor += Number(item.subtotal);
          });
        }
      });

      // Calcular inventário (estoque atual)
      const inventario = {
        quantidade: entradas.quantidade - saidas.quantidade,
        valor: entradas.valor - saidas.valor
      };

      return {
        entradas,
        saidas,
        inventario
      };
    } catch (error) {
      console.error('Erro ao obter resumo:', error);
      throw error;
    }
  }
}; 