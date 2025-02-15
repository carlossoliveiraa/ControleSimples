import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';

interface SaidaProduto {
  id: string;
  data: string;
  produto: {
    id: string;
    nome: string;
    sku: string;
  };
  quantidade: number;
  valor_unitario: number;
  cliente?: {
    id: string;
    nome: string;
  };
  motivo: 'venda' | 'perda' | 'ajuste' | 'devolucao';
  status: 'pendente' | 'concluido' | 'cancelado';
}

export function Saidas() {
  const [saidas, setSaidas] = useState<SaidaProduto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarSaidas();
  }, []);

  async function carregarSaidas() {
    try {
      // Aqui você faria a chamada real para sua API
      const data = [
        {
          id: '1',
          data: '2024-03-10',
          produto: {
            id: '1',
            nome: 'Produto A',
            sku: 'SKU001'
          },
          quantidade: 5,
          valor_unitario: 29.90,
          cliente: {
            id: '1',
            nome: 'Cliente A'
          },
          motivo: 'venda',
          status: 'concluido'
        }
      ];

      setSaidas(data);
    } catch (error) {
      console.error('Erro ao carregar saídas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar saídas',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getMotivoLabel = (motivo: string) => {
    const labels = {
      venda: 'Venda',
      perda: 'Perda/Quebra',
      ajuste: 'Ajuste de Estoque',
      devolucao: 'Devolução'
    };
    return labels[motivo as keyof typeof labels];
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Saída de Produtos</h1>
            <p className="text-gray-600 mt-1">Gerencie as saídas de produtos do estoque</p>
          </div>

          <button
            onClick={() => navigate('/transacoes/saidas/novo')}
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
          >
            Nova Saída
          </button>
        </div>
      </div>

      {/* Tabela de Saídas */}
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
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Produto</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Quantidade</th>
                  <th className="px-6 py-3 font-medium">Valor Unit.</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Motivo</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {saidas.map(saida => (
                  <tr key={saida.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 text-sm">
                      {new Date(saida.data).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{saida.produto.nome}</td>
                    <td className="px-6 py-4 text-sm">{saida.produto.sku}</td>
                    <td className="px-6 py-4 text-sm">{saida.quantidade}</td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(saida.valor_unitario)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(saida.valor_unitario * saida.quantidade)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {saida.cliente?.nome || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getMotivoLabel(saida.motivo)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        saida.status === 'concluido'
                          ? 'bg-green-50 text-green-700'
                          : saida.status === 'pendente'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {saida.status.charAt(0).toUpperCase() + saida.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {/* Implementar edição */}}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
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