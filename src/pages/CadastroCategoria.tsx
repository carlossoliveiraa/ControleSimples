import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriasService } from '../services/categorias';
import type { Categoria, CategoriaFormData } from '../types';
import Swal from 'sweetalert2';
import { FormHeader } from '../components/FormHeader';

export function CadastroCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaFormData>({
    nome: '',
    descricao: '',
    cor: '#4A90E2',
    ativa: true
  });

  useEffect(() => {
    if (id) {
      carregarCategoria(id);
    }
  }, [id]);

  async function carregarCategoria(id: string) {
    try {
      setIsLoading(true);
      const data = await categoriasService.getById(id);
      if (data) {
        setCategoria({
          nome: data.nome,
          descricao: data.descricao,
          cor: data.cor,
          ativa: data.ativa
        });
      }
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar categoria',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!categoria.nome.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nome obrigatório',
        text: 'Por favor, informe o nome da categoria'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (id) {
        await categoriasService.update(id, categoria);
        Swal.fire({
          icon: 'success',
          title: 'Categoria atualizada com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        await categoriasService.create(categoria);
        Swal.fire({
          icon: 'success',
          title: 'Categoria criada com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
      }
      
      navigate('/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar categoria',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoria(prev => ({
      ...prev,
      ativa: e.target.checked
    }));
  };

  return (
    <div>
      <FormHeader
        title={id ? 'Editar Categoria' : 'Nova Categoria'}
        subtitle={id ? 'Altere os dados da categoria' : 'Cadastre uma nova categoria'}
        backTo="/categorias"
      />

      <main className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={categoria.nome}
                onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                placeholder="Nome da categoria"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={categoria.cor}
                  onChange={(e) => setCategoria({ ...categoria, cor: e.target.value })}
                  className="w-12 h-8 p-1 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={categoria.cor}
                  onChange={(e) => setCategoria({ ...categoria, cor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={categoria.descricao}
              onChange={(e) => setCategoria({ ...categoria, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
              rows={4}
              placeholder="Descrição da categoria"
            />
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={categoria.ativa}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2] cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">
                Categoria {categoria.ativa ? 'ativa' : 'inativa'}
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/categorias')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] flex items-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 