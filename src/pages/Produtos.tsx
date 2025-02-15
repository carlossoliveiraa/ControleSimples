import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtosService } from '../services/produtos';
import type { Produto } from '../types';
import Swal from 'sweetalert2';
import { formataMoeda } from '../utils/formatters';

export function Produtos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setIsLoading(true);
      const { produtos } = await produtosService.listar();
      setProdutos(produtos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar produtos',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (produto: Produto) => {
    navigate(`/produtos/${produto.id}`);
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
        await produtosService.excluir(id);
        await carregarProdutos();
        Swal.fire('Excluído!', 'Produto excluído com sucesso.', 'success');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir produto',
        text: 'Tente novamente mais tarde'
      });
    }
  };

  const calcularMargem = (precoVenda: number, custo: number | null) => {
    if (!custo || custo === 0) return '-';
    const margem = ((precoVenda - custo) / custo) * 100;
    return `${margem.toFixed(2)}%`;
  };

  const getInitial = (nome: string) => {
    return nome.charAt(0).toUpperCase();
  };

  return (
    <div>
      {/* Header da Página */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Produtos</h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/categorias')}
              className="px-4 py-2 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-lg hover:bg-[#4A90E2] hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Gerenciar Categorias
            </button>
            <button
              onClick={() => navigate('/produtos/novo')}
              className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Produto
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
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
                  <th className="px-6 py-3 font-medium">Foto</th>
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Preço</th>
                  <th className="px-6 py-3 font-medium">Custo</th>
                  <th className="px-6 py-3 font-medium">Margem</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4">
                      {produto.avatar_url ? (
                        <div className="relative group">
                          <img 
                            src={produto.avatar_url} 
                            alt={produto.nome}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => handleEdit(produto)}
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Editar imagem"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600">
                            {getInitial(produto.nome)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{produto.nome}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{produto.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {produto.categoria?.nome}
                        {produto.categoria && !produto.categoria.ativa && (
                          <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-full" title="Categoria inativa">
                            Categoria inativa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formataMoeda(produto.preco_venda)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {produto.custo ? formataMoeda(produto.custo) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {calcularMargem(produto.preco_venda, produto.custo)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        produto.ativo
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(produto)}
                          className="text-gray-400 hover:text-[#4A90E2] transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
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