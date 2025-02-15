import { useState, useEffect } from 'react';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';

interface ProdutoEstoque {
  id: string;
  nome: string;
  sku: string;
  quantidade_atual: number;
  quantidade_minima: number;
  valor_medio: number;
  valor_total: number;
  ultima_entrada: string;
  ultima_saida: string;
  status: 'normal' | 'baixo' | 'critico';
}

export function Inventario() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarInventario();
  }, []);

  async function carregarInventario() {
    try {
      // Aqui você faria a chamada real para sua API
      const data = [
        {
          id: '1',
          nome: 'Produto A',
          sku: 'SKU001',
          quantidade_atual: 150,
          quantidade_minima: 50,
          valor_medio: 25.90,
          valor_total: 3885.00,
          ultima_entrada: '2024-03-10',
          ultima_saida: '2024-03-08',
          status: 'normal'
        }
      ];

      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar inventário',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Inventário</h1>
            <p className="text-gray-600 mt-1">Controle seu estoque de produtos</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {/* Implementar exportação */}}
              className="px-4 py-2 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-lg hover:bg-[#4A90E2] hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar
            </button>
            
            <button
              onClick={() => {/* Implementar ajuste */}}
              className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              Ajuste de Estoque
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Valor Total em Estoque</h3>
          <p className="text-2xl font-bold text-gray-900">{formataMoeda(387650.90)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Produtos com Estoque Baixo</h3>
          <p className="text-2xl font-bold text-yellow-500">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Produtos em Estoque</h3>
          <p className="text-2xl font-bold text-gray-900">406</p>
        </div>
      </div>

      {/* Tabela de Inventário */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Produto</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Qtd. Atual</th>
                  <th className="px-6 py-3 font-medium">Qtd. Mínima</th>
                  <th className="px-6 py-3 font-medium">Valor Médio</th>
                  <th className="px-6 py-3 font-medium">Valor Total</th>
                  <th className="px-6 py-3 font-medium">Última Entrada</th>
                  <th className="px-6 py-3 font-medium">Última Saída</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 text-sm">{produto.nome}</td>
                    <td className="px-6 py-4 text-sm">{produto.sku}</td>
                    <td className="px-6 py-4 text-sm">{produto.quantidade_atual}</td>
                    <td className="px-6 py-4 text-sm">{produto.quantidade_minima}</td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(produto.valor_medio)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(produto.valor_total)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(produto.ultima_entrada).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(produto.ultima_saida).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        produto.status === 'normal'
                          ? 'bg-green-50 text-green-700'
                          : produto.status === 'baixo'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {produto.status.charAt(0).toUpperCase() + produto.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 