import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { produtoService } from '../services/produtos';
import { categoriaService } from '../services/categorias';
import type { Produto, ProdutoFormData, Categoria } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import Swal from 'sweetalert2';

export function EditarProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    descricao: '',
    sku: '',
    codigo_barras: '',
    categoria_id: '',
    preco_venda: 0,
    preco_promocional: 0,
    custo: 0,
    peso: 0,
    comprimento: 0,
    largura: 0,
    altura: 0,
    ativo: true,
    avatar_url: null
  });

  useEffect(() => {
    carregarCategorias();
    if (id) {
      carregarProduto(id);
    }
  }, [id]);

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
    }
  }

  async function carregarProduto(produtoId: string) {
    try {
      setIsLoading(true);
      const { produto } = await produtoService.buscarPorId(produtoId);
      if (produto) {
        setFormData({
          nome: produto.nome,
          descricao: produto.descricao || '',
          sku: produto.sku,
          codigo_barras: produto.codigo_barras || '',
          categoria_id: produto.categoria_id,
          preco_venda: produto.preco_venda,
          preco_promocional: produto.preco_promocional || 0,
          custo: produto.custo || 0,
          peso: produto.peso || 0,
          comprimento: produto.comprimento || 0,
          largura: produto.largura || 0,
          altura: produto.altura || 0,
          ativo: produto.ativo,
          avatar_url: produto.avatar_url
        });
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar produto',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageSelect = async (file: File) => {
    try {
      setIsUpdatingAvatar(true);
      const { url } = await produtoService.uploadAvatar(file);
      setFormData(prev => ({ ...prev, avatar_url: url }));
    } catch (error: any) {
      console.error('Erro ao atualizar imagem:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar imagem',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleImageRemove = async () => {
    try {
      const result = await Swal.fire({
        title: 'Remover imagem?',
        text: 'Tem certeza que deseja remover a imagem?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4A90E2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed && formData.avatar_url) {
        setIsUpdatingAvatar(true);
        await produtoService.removeAvatar(formData.avatar_url);
        setFormData(prev => ({ ...prev, avatar_url: null }));
      }
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao remover imagem',
        text: 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória';
    }

    if (formData.preco_venda <= 0) {
      newErrors.preco_venda = 'Preço de venda deve ser maior que zero';
    }

    // Validar dimensões e peso (se informados)
    if (formData.peso && formData.peso < 0) {
      newErrors.peso = 'Peso não pode ser negativo';
    }

    if (formData.comprimento && formData.comprimento < 0) {
      newErrors.comprimento = 'Comprimento não pode ser negativo';
    }

    if (formData.largura && formData.largura < 0) {
      newErrors.largura = 'Largura não pode ser negativa';
    }

    if (formData.altura && formData.altura < 0) {
      newErrors.altura = 'Altura não pode ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      if (id) {
        await produtoService.atualizar(id, formData);
      } else {
        await produtoService.criar(formData);
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: `Produto ${id ? 'atualizado' : 'cadastrado'} com sucesso!`,
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar produto',
        text: 'Por favor, tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calcularMargem = () => {
    if (!formData.custo || formData.custo === 0) return 0;
    return ((formData.preco_venda - formData.custo) / formData.custo) * 100;
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                {id ? 'Editar Produto' : 'Novo Produto'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna da Esquerda - Imagem */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem do Produto
                    </label>
                    <ImageUpload
                      imageUrl={formData.avatar_url}
                      isLoading={isUpdatingAvatar}
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                    />
                  </div>
                </div>

                {/* Colunas da Direita - Campos do formulário */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.nome ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.nome && (
                        <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU *
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.sku ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.sku && (
                        <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de Barras
                      </label>
                      <input
                        type="text"
                        value={formData.codigo_barras}
                        onChange={(e) => setFormData(prev => ({ ...prev, codigo_barras: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        value={formData.categoria_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoria_id: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.categoria_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </option>
                        ))}
                      </select>
                      {errors.categoria_id && (
                        <p className="mt-1 text-sm text-red-500">{errors.categoria_id}</p>
                      )}
                    </div>
                  </div>

                  {/* Descrição */}
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

                  {/* Preços */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Venda *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.preco_venda}
                        onChange={(e) => setFormData(prev => ({ ...prev, preco_venda: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.preco_venda ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.preco_venda && (
                        <p className="mt-1 text-sm text-red-500">{errors.preco_venda}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Promocional
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.preco_promocional}
                        onChange={(e) => setFormData(prev => ({ ...prev, preco_promocional: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custo
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.custo}
                        onChange={(e) => setFormData(prev => ({ ...prev, custo: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      />
                      {formData.custo > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                          Margem: {calcularMargem().toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dimensões e Peso */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={formData.peso}
                        onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.peso ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.peso && (
                        <p className="mt-1 text-sm text-red-500">{errors.peso}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comprimento (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.comprimento}
                        onChange={(e) => setFormData(prev => ({ ...prev, comprimento: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.comprimento ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.comprimento && (
                        <p className="mt-1 text-sm text-red-500">{errors.comprimento}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Largura (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.largura}
                        onChange={(e) => setFormData(prev => ({ ...prev, largura: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.largura ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.largura && (
                        <p className="mt-1 text-sm text-red-500">{errors.largura}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.altura}
                        onChange={(e) => setFormData(prev => ({ ...prev, altura: parseFloat(e.target.value) || 0 }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.altura ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.altura && (
                        <p className="mt-1 text-sm text-red-500">{errors.altura}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
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
              </div>

              {/* Botões */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/produtos')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 