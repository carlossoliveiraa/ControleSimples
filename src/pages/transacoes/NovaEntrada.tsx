import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { entradasService } from '../../services/entradas';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';
import type { Produto } from '../../types';

interface ProdutoSelecionado extends Produto {
  quantidade: number;
  valor_unitario: number;
}

interface ProdutoLista {
  id: string;
  nome: string;
  sku: string;
  preco_venda: number;
  categoria_id: string;
  categoria: {
    nome: string;
  }[];
  descricao?: string;
  avatar_url?: string | null;
  codigo_barras?: string;
  preco_promocional?: number;
  custo?: number;
  peso?: number;
  comprimento?: number;
  largura?: number;
  altura?: number;
  ativo: boolean;
}

export function NovaEntrada() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [produtos, setProdutos] = useState<ProdutoLista[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      buscarProdutos();
    } else {
      setProdutos([]);
    }
  }, [searchTerm]);

  const buscarProdutos = async () => {
    try {
      const data = await entradasService.buscarProdutos(searchTerm);
      setProdutos(data.map(item => ({
        ...item,
        categoria_id: item.categoria?.[0]?.id || '',
        ativo: true
      })));
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleProdutoSelect = (produto: ProdutoLista) => {
    setProdutosSelecionados(prev => [
      ...prev,
      {
        ...produto,
        quantidade: 1,
        valor_unitario: produto.preco_venda,
        descricao: produto.descricao || '',
        avatar_url: produto.avatar_url || null,
        codigo_barras: produto.codigo_barras || '',
        categoria_id: produto.categoria_id
      } as ProdutoSelecionado
    ]);
    setSearchTerm('');
    setProdutos([]);
    setShowResults(false);
  };

  const handleQuantidadeChange = (id: string, quantidade: number) => {
    setProdutosSelecionados(prev =>
      prev.map(p => 
        p.id === id ? { ...p, quantidade: Math.max(1, quantidade) } : p
      )
    );
  };

  const handleValorChange = (id: string, valor: number) => {
    setProdutosSelecionados(prev =>
      prev.map(p => 
        p.id === id ? { ...p, valor_unitario: Math.max(0, valor) } : p
      )
    );
  };

  const handleRemoveProduto = (id: string) => {
    setProdutosSelecionados(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (produtosSelecionados.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Nenhum produto selecionado',
        text: 'Adicione pelo menos um produto para continuar'
      });
      return;
    }

    try {
      setIsLoading(true);

      // Salvar cada produto como uma entrada separada
      for (const produto of produtosSelecionados) {
        await entradasService.salvarEntrada({
          data: new Date().toISOString(),
          produto: {
            id: produto.id,
            nome: produto.nome,
            sku: produto.sku
          },
          quantidade: produto.quantidade,
          valor_unitario: produto.valor_unitario,
          documento: null,
          status: 'concluido',
          observacoes: null
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Entrada registrada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });

      // Redirecionar para a lista de entradas
      navigate('/transacoes/entradas');
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar entrada',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Nova Entrada de Produtos</h1>
              <p className="text-gray-600 mt-1">Registre uma nova entrada no estoque</p>
            </div>

            <button
              onClick={() => navigate('/transacoes/entradas')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Busca de Produtos */}
            <div className="relative mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Produto
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Digite o nome ou SKU do produto"
              />

              {/* Resultados da Busca */}
              {showResults && produtos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {produtos.map(produto => (
                    <div
                      key={produto.id}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProdutoSelect(produto)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{produto.nome}</span>
                          <span className="text-sm text-gray-500 ml-2">SKU: {produto.sku}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {formataMoeda(produto.preco_venda)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de Produtos Selecionados */}
            {produtosSelecionados.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos Selecionados</h3>
                <div className="space-y-4">
                  {produtosSelecionados.map(produto => (
                    <div key={produto.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{produto.nome}</h4>
                        <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Quantidade</label>
                          <input
                            type="number"
                            value={produto.quantidade}
                            onChange={(e) => handleQuantidadeChange(produto.id, parseInt(e.target.value))}
                            className="w-24 px-3 py-1 border border-gray-300 rounded-md"
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Valor Unit.</label>
                          <input
                            type="number"
                            value={produto.valor_unitario}
                            onChange={(e) => handleValorChange(produto.id, parseFloat(e.target.value))}
                            className="w-32 px-3 py-1 border border-gray-300 rounded-md"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Total</label>
                          <div className="px-3 py-1 bg-gray-50 rounded-md w-32 text-right">
                            {formataMoeda(produto.quantidade * produto.valor_unitario)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProduto(produto.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={isLoading || produtosSelecionados.length === 0}
                className={`px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2 ${
                  (isLoading || produtosSelecionados.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
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
                    Salvar Entrada
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 