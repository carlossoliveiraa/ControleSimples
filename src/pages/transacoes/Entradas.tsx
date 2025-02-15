import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { entradasService, type EntradaProduto } from '../../services/entradas';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';

export function Entradas() {
  const [entradas, setEntradas] = useState<EntradaProduto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarEntradas();
  }, []);

  async function carregarEntradas() {
    try {
      setIsLoading(true);
      const data = await entradasService.listarEntradas();
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

  const handleDelete = async (entrada: EntradaProduto) => {
    try {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: `Deseja realmente excluir a entrada do produto "${entrada.produto?.nome}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await entradasService.deletarEntrada(entrada.id);
        
        Swal.fire({
          icon: 'success',
          title: 'Entrada excluída com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });

        // Recarregar a lista
        carregarEntradas();
      }
    } catch (error) {
      console.error('Erro ao deletar entrada:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir entrada',
        text: 'Tente novamente mais tarde'
      });
    }
  };

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
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
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
        ) : entradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>Nenhuma entrada encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Produto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SKU</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Quantidade</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor Unit.</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {entradas.map((entrada) => (
                  <tr key={entrada.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      {new Date(entrada.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">{entrada.produto?.nome || 'Produto não encontrado'}</td>
                    <td className="py-3 px-4">{entrada.produto?.sku || '-'}</td>
                    <td className="py-3 px-4 text-right">{entrada.quantidade}</td>
                    <td className="py-3 px-4 text-right">{formataMoeda(entrada.valor_unitario)}</td>
                    <td className="py-3 px-4 text-right">
                      {formataMoeda(entrada.quantidade * entrada.valor_unitario)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`
                        inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full
                        ${entrada.status === 'concluido' 
                          ? 'bg-green-50 text-green-700' 
                          : entrada.status === 'pendente'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'}
                      `}>
                        {entrada.status.charAt(0).toUpperCase() + entrada.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {/* Implementar visualização */}}
                          className="text-gray-400 hover:text-gray-600"
                          title="Visualizar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {entrada.status !== 'concluido' && (
                          <button
                            onClick={() => handleDelete(entrada)}
                            className="text-gray-400 hover:text-red-600"
                            title="Excluir"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
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