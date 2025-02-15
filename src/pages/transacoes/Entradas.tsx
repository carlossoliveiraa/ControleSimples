import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';

interface EntradaProduto {
  id: string;
  data: string;
  produto: {
    id: string;
    nome: string;
    sku: string;
  };
  quantidade: number;
  valor_unitario: number;
  fornecedor: {
    id: string;
    nome: string;
  };
  nota_fiscal: string;
  status: 'pendente' | 'concluido' | 'cancelado';
}

export function Entradas() {
  const [entradas, setEntradas] = useState<EntradaProduto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarEntradas();
  }, []);

  async function carregarEntradas() {
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
          quantidade: 100,
          valor_unitario: 25.90,
          fornecedor: {
            id: '1',
            nome: 'Fornecedor A'
          },
          nota_fiscal: 'NF-001',
          status: 'concluido'
        },
        // ... mais dados
      ];

      setEntradas(data);
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar entradas',
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
            <h1 className="text-2xl font-semibold text-gray-800">Entrada de Produtos</h1>
            <p className="text-gray-600 mt-1">Gerencie as entradas de produtos no estoque</p>
          </div>

          <button
            onClick={() => navigate('/transacoes/entradas/novo')}
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
          >
            Nova Entrada
          </button>
        </div>
      </div>

      {/* Tabela de Entradas */}
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
                  <th className="px-6 py-3 font-medium">Fornecedor</th>
                  <th className="px-6 py-3 font-medium">NF</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {entradas.map(entrada => (
                  <tr key={entrada.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 text-sm">
                      {new Date(entrada.data).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{entrada.produto.nome}</td>
                    <td className="px-6 py-4 text-sm">{entrada.produto.sku}</td>
                    <td className="px-6 py-4 text-sm">{entrada.quantidade}</td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(entrada.valor_unitario)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formataMoeda(entrada.valor_unitario * entrada.quantidade)}
                    </td>
                    <td className="px-6 py-4 text-sm">{entrada.fornecedor.nome}</td>
                    <td className="px-6 py-4 text-sm">{entrada.nota_fiscal}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entrada.status === 'concluido'
                          ? 'bg-green-50 text-green-700'
                          : entrada.status === 'pendente'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {entrada.status.charAt(0).toUpperCase() + entrada.status.slice(1)}
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