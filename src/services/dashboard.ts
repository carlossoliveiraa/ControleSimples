import { supabase } from './supabase';

export interface DashboardData {
  resumo: {
    total_produtos: number;
    valor_em_estoque: number;
    produtos_criticos: number;
    produtos_baixos: number;
  };
  movimentacoes_recentes: Array<{
    id: string;
    data: string;
    tipo: 'entrada' | 'saida';
    produto: {
      nome: string;
      sku: string;
    };
    quantidade: number;
    valor_total: number;
  }>;
  produtos_criticos: Array<{
    id: string;
    nome: string;
    sku: string;
    quantidade_atual: number;
    quantidade_minima: number;
  }>;
  grafico_movimentacoes: Array<{
    data: string;
    entradas: number;
    saidas: number;
  }>;
}

export const dashboardService = {
  async obterDados(): Promise<DashboardData> {
    try {
      // 1. Buscar produtos ativos e calcular estoque
      const { data: produtos, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true);

      if (produtosError) throw produtosError;

      // 2. Buscar todas as movimentações para calcular estoque
      const { data: movimentacoes, error: movError } = await supabase
        .from('movimentacao_itens')
        .select(`
          quantidade,
          valor_unitario,
          subtotal,
          produto_id,
          movimentacao:movimentacoes(
            id,
            tipo,
            data,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (movError) throw movError;

      // Calcular estoque atual de cada produto
      const estoqueProdutos = new Map();
      produtos.forEach(produto => {
        estoqueProdutos.set(produto.id, {
          ...produto,
          quantidade_atual: 0,
          valor_total: 0
        });
      });

      // Processar movimentações
      movimentacoes.forEach((mov: any) => {
        if (mov.movimentacao?.status === 'concluido') {
          const produto = estoqueProdutos.get(mov.produto_id);
          if (produto) {
            if (mov.movimentacao.tipo === 'entrada') {
              produto.quantidade_atual += Number(mov.quantidade);
              produto.valor_total += Number(mov.subtotal);
            } else {
              produto.quantidade_atual -= Number(mov.quantidade);
            }
          }
        }
      });

      // Calcular resumo
      const resumo = {
        total_produtos: produtos.length,
        valor_em_estoque: 0,
        produtos_criticos: 0,
        produtos_baixos: 0
      };

      // Lista de produtos críticos
      const produtos_criticos: DashboardData['produtos_criticos'] = [];

      estoqueProdutos.forEach(produto => {
        resumo.valor_em_estoque += produto.valor_total;

        if (produto.quantidade_atual <= 0) {
          resumo.produtos_criticos++;
          produtos_criticos.push({
            id: produto.id,
            nome: produto.nome,
            sku: produto.sku,
            quantidade_atual: produto.quantidade_atual,
            quantidade_minima: produto.quantidade_minima
          });
        } else if (produto.quantidade_atual <= produto.quantidade_minima) {
          resumo.produtos_baixos++;
          if (produtos_criticos.length < 5) { // Limitar a 5 produtos
            produtos_criticos.push({
              id: produto.id,
              nome: produto.nome,
              sku: produto.sku,
              quantidade_atual: produto.quantidade_atual,
              quantidade_minima: produto.quantidade_minima
            });
          }
        }
      });

      // Últimas 10 movimentações
      const movimentacoes_recentes = movimentacoes
        .filter((mov: any) => mov.movimentacao?.status === 'concluido')
        .slice(0, 10)
        .map((mov: any) => {
          const produto = estoqueProdutos.get(mov.produto_id);
          return {
            id: mov.movimentacao.id,
            data: mov.movimentacao.data,
            tipo: mov.movimentacao.tipo,
            produto: {
              nome: produto?.nome || 'Produto não encontrado',
              sku: produto?.sku || '-'
            },
            quantidade: Number(mov.quantidade),
            valor_total: Number(mov.subtotal)
          };
        });

      // Dados para o gráfico - últimos 7 dias
      const hoje = new Date();
      const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);
        return data.toISOString().split('T')[0];
      }).reverse();

      const grafico_movimentacoes = ultimos7Dias.map(data => {
        const movsDia = movimentacoes.filter((mov: any) => 
          mov.movimentacao?.status === 'concluido' && 
          mov.movimentacao.data.startsWith(data)
        );

        return {
          data,
          entradas: movsDia.filter((mov: any) => mov.movimentacao.tipo === 'entrada')
            .reduce((acc: number, mov: any) => acc + Number(mov.quantidade), 0),
          saidas: movsDia.filter((mov: any) => mov.movimentacao.tipo === 'saida')
            .reduce((acc: number, mov: any) => acc + Number(mov.quantidade), 0)
        };
      });

      return {
        resumo,
        movimentacoes_recentes,
        produtos_criticos,
        grafico_movimentacoes
      };
    } catch (error) {
      console.error('Erro ao obter dados do dashboard:', error);
      throw error;
    }
  }
}; 