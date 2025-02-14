import { useState, useEffect } from 'react';
import { categoriaService } from '../services/categorias';
import type { Categoria } from '../types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', ativo: true });
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const { categorias } = await categoriaService.listar();
      setCategorias(categorias);
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

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
      ativo: categoria.ativo
    });
    setShowForm(true);
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
        await categoriaService.excluir(id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nome é obrigatório'
      });
      return;
    }

    try {
      if (selectedCategoria) {
        await categoriaService.atualizar(selectedCategoria.id, formData);
      } else {
        await categoriaService.criar(formData);
      }

      await carregarCategorias();
      setShowForm(false);
      setSelectedCategoria(null);
      setFormData({ nome: '', descricao: '', ativo: true });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: `Categoria ${selectedCategoria ? 'atualizada' : 'criada'} com sucesso!`,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar categoria',
        text: 'Por favor, tente novamente.'
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
              <span className="text-xl font-semibold text-gray-800">Categorias</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategoria(null);
                  setFormData({ nome: '', descricao: '', ativo: true });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
              >
                Nova Categoria
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
                    <th className="px-6 py-3 font-medium">Descrição</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(categoria => (
                    <tr key={categoria.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{categoria.nome}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {categoria.descricao || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          categoria.ativo
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {categoria.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(categoria)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(categoria.id)}
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

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.ativo ? 'ativo' : 'inativo'}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'ativo' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 