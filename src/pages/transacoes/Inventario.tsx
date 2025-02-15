import { useState, useEffect } from 'react';
import { inventarioService, type ProdutoEstoque } from '../../services/inventario';
import { formataMoeda } from '../../utils/formatters';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function Inventario() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // todos, baixo, critico

  useEffect(() => {
    carregarInventario();
  }, []);

  async function carregarInventario() {
    try {
      setIsLoading(true);
      const data = await inventarioService.listarEstoque();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar inventário',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const produtosFiltrados = produtos.filter(produto => {
    if (filtro === 'todos') return true;
    return produto.status === filtro;
  });

  const totais = {
    produtos: produtosFiltrados.length,
    quantidade: produtosFiltrados.reduce((acc, p) => acc + p.quantidade_atual, 0),
    valor: produtosFiltrados.reduce((acc, p) => acc + p.valor_total, 0)
  };

  const handleExportar = () => {
    try {
      // Preparar dados para exportação
      const dadosExport = produtosFiltrados.map(produto => ({
        'Produto': produto.nome,
        'SKU': produto.sku,
        'Quantidade Atual': produto.quantidade_atual,
        'Quantidade Mínima': produto.quantidade_minima,
        'Valor Médio': formataMoeda(produto.valor_medio),
        'Valor Total': formataMoeda(produto.valor_total),
        'Status': produto.status.charAt(0).toUpperCase() + produto.status.slice(1),
        'Última Entrada': produto.ultima_entrada 
          ? new Date(produto.ultima_entrada).toLocaleDateString('pt-BR')
          : '-',
        'Última Saída': produto.ultima_saida
          ? new Date(produto.ultima_saida).toLocaleDateString('pt-BR')
          : '-'
      }));

      // Criar planilha
      const ws = XLSX.utils.json_to_sheet(dadosExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventário");

      // Gerar arquivo
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      
      // Salvar arquivo
      const fileName = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);

      Swal.fire({
        icon: 'success',
        title: 'Exportação concluída!',
        text: 'O arquivo foi baixado com sucesso.',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao exportar',
        text: 'Não foi possível gerar o arquivo'
      });
    }
  };

  const handleAjusteEstoque = async (produto: ProdutoEstoque) => {
    const { value: quantidade } = await Swal.fire({
      title: 'Ajuste de Estoque',
      html: `
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Produto: ${produto.nome}</p>
          <p class="text-sm text-gray-600 mb-4">Quantidade Atual: ${produto.quantidade_atual}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-2">Nova Quantidade:</label>
          <input 
            type="number" 
            id="quantidade" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            value="${produto.quantidade_atual}"
            min="0"
          />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4A90E2',
      preConfirm: () => {
        const input = document.getElementById('quantidade') as HTMLInputElement;
        const valor = Number(input.value);
        if (valor < 0) {
          Swal.showValidationMessage('A quantidade não pode ser negativa');
          return false;
        }
        return valor;
      }
    });

    if (quantidade !== undefined && quantidade !== false) {
      try {
        await inventarioService.ajustarEstoque(produto.id, quantidade);
        
        Swal.fire({
          icon: 'success',
          title: 'Estoque ajustado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });

        carregarInventario(); // Recarregar dados
      } catch (error) {
        console.error('Erro ao ajustar estoque:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao ajustar estoque',
          text: 'Tente novamente mais tarde'
        });
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Inventário</h1>
            <p className="text-gray-600 mt-1">Controle do estoque de produtos</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleExportar}
              className="px-4 py-2 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-lg hover:bg-[#4A90E2] hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar
            </button>

            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            >
              <option value="todos">Todos os produtos</option>
              <option value="baixo">Estoque baixo</option>
              <option value="critico">Estoque crítico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
          <p className="text-2xl font-semibold mt-2">{totais.produtos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Quantidade Total</h3>
          <p className="text-2xl font-semibold mt-2">{totais.quantidade}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Valor Total em Estoque</h3>
          <p className="text-2xl font-semibold mt-2 text-[#4A90E2]">{formataMoeda(totais.valor)}</p>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Produto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SKU</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Qtde. Atual</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Qtde. Mínima</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor Médio</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Última Entrada</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Última Saída</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4">{produto.sku}</td>
                    <td className="py-3 px-4 text-right">{produto.quantidade_atual}</td>
                    <td className="py-3 px-4 text-right">{produto.quantidade_minima}</td>
                    <td className="py-3 px-4 text-right">{formataMoeda(produto.valor_medio)}</td>
                    <td className="py-3 px-4 text-right">{formataMoeda(produto.valor_total)}</td>
                    <td className="py-3 px-4">
                      <span className={`
                        inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full
                        ${produto.status === 'normal' 
                          ? 'bg-green-50 text-green-700' 
                          : produto.status === 'baixo'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'}
                      `}>
                        {produto.status.charAt(0).toUpperCase() + produto.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {produto.ultima_entrada 
                        ? new Date(produto.ultima_entrada).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {produto.ultima_saida
                        ? new Date(produto.ultima_saida).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAjusteEstoque(produto)}
                        className="text-gray-400 hover:text-[#4A90E2] transition-colors"
                        title="Ajustar Estoque"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
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