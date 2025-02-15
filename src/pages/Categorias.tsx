import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriasService } from '../services/categorias';
import type { Categoria } from '../types';
import Swal from 'sweetalert2';

export function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setIsLoading(true);
      const data = await categoriasService.getAll();
      setCategorias(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar categorias',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

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
        await categoriasService.delete(id);
        await carregarCategorias();
        Swal.fire('Excluído!', 'Categoria excluída com sucesso.', 'success');
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir categoria',
        text: 'Tente novamente mais tarde'
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Categorias</h1>
          
          <button
            onClick={() => navigate('/categorias/nova')}
            className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Categoria
          </button>
        </div>
      </div>

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
                  <th className="px-6 py-3 font-medium">Cor</th>
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Descrição</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(categoria => (
                  <tr key={categoria.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: categoria.cor }}
                        title={categoria.cor}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{categoria.nome}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {categoria.descricao || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        categoria.ativa
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {categoria.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/categorias/${categoria.id}`)}
                          className="text-gray-400 hover:text-[#4A90E2] transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
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
        )}
      </div>
    </div>
  );
} 