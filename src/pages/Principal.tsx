import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, type DashboardData } from '../services/dashboard';
import { formataMoeda } from '../utils/formatters';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function Principal() {
  const navigate = useNavigate();
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setIsLoading(true);
      const data = await dashboardService.obterDados();
      setDados(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
          <p className="text-2xl font-semibold mt-2">{dados?.resumo.total_produtos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Valor em Estoque</h3>
          <p className="text-2xl font-semibold mt-2 text-[#4A90E2]">
            {formataMoeda(dados?.resumo.valor_em_estoque || 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Produtos Críticos</h3>
          <p className="text-2xl font-semibold mt-2 text-red-500">{dados?.resumo.produtos_criticos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Produtos Baixos</h3>
          <p className="text-2xl font-semibold mt-2 text-yellow-500">{dados?.resumo.produtos_baixos}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Movimentações */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Movimentações - Últimos 7 dias</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados?.grafico_movimentacoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [value, 'Quantidade']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="#4CAF50" 
                  name="Entradas"
                />
                <Line 
                  type="monotone" 
                  dataKey="saidas" 
                  stroke="#f44336" 
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de Produtos Críticos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Produtos com Estoque Crítico</h3>
          <div className="space-y-4">
            {dados?.produtos_criticos.map(produto => (
              <div 
                key={produto.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{produto.nome}</h4>
                  <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-red-500">{produto.quantidade_atual}</p>
                  <p className="text-sm text-gray-500">Mín: {produto.quantidade_minima}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas Movimentações */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Últimas Movimentações</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Data</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Produto</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Quantidade</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {dados?.movimentacoes_recentes.map(mov => (
                <tr key={mov.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">
                    {new Date(mov.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${mov.tipo === 'entrada' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                    `}>
                      {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{mov.produto.nome}</p>
                      <p className="text-sm text-gray-500">SKU: {mov.produto.sku}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">{mov.quantidade}</td>
                  <td className="py-3 px-4 text-right">{formataMoeda(mov.valor_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 