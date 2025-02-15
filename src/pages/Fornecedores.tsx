import { useState, useEffect } from 'react';
import { fornecedorService } from '../services/fornecedores';
import type { Fornecedor } from '../types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarFornecedores();
  }, []);

  async function carregarFornecedores() {
    try {
      const { fornecedores } = await fornecedorService.listar();
      setFornecedores(fornecedores);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar fornecedores',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (fornecedor: Fornecedor) => {
    navigate(`/fornecedores/${fornecedor.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não poderá ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4A90E2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await fornecedorService.excluir(id);
        await carregarFornecedores();
        Swal.fire('Excluído!', 'Fornecedor excluído com sucesso.', 'success');
      }
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir fornecedor',
        text: 'Tente novamente mais tarde'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">Fornecedores</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/fornecedores/novo')}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Fornecedor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">Nome</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">CNPJ</th>
                    <th className="px-6 py-3 font-medium">Site</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map(fornecedor => (
                    <tr key={fornecedor.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{fornecedor.nome}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fornecedor.cnpj}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <a 
                          href={fornecedor.site} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#4A90E2] hover:underline"
                        >
                          {fornecedor.site}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          fornecedor.ativo
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(fornecedor)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(fornecedor.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 