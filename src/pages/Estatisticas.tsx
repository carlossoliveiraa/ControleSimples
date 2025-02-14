import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { formataMoeda } from '../utils/formatters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function Estatisticas() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalClientes: 0,
    totalFornecedores: 0,
    vendasMes: 0,
    ticketMedio: 0,
    produtosMaisVendidos: [],
    vendasPorDia: [],
    vendasPorCategoria: [],
    clientesPorStatus: []
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  // Simulando dados para demonstração
  async function carregarEstatisticas() {
    try {
      // Aqui você faria as chamadas reais para sua API
      const data = {
        totalProdutos: 156,
        totalClientes: 89,
        totalFornecedores: 12,
        vendasMes: 45678.90,
        ticketMedio: 234.56,
        produtosMaisVendidos: [
          { nome: 'Produto A', quantidade: 45 },
          { nome: 'Produto B', quantidade: 38 },
          { nome: 'Produto C', quantidade: 31 },
          { nome: 'Produto D', quantidade: 25 },
          { nome: 'Produto E', quantidade: 22 }
        ],
        vendasPorDia: [
          { dia: '01/03', valor: 1234.56 },
          { dia: '02/03', valor: 2345.67 },
          { dia: '03/03', valor: 3456.78 },
          { dia: '04/03', valor: 2567.89 },
          { dia: '05/03', valor: 4567.89 },
          { dia: '06/03', valor: 3678.90 },
          { dia: '07/03', valor: 5678.90 }
        ],
        vendasPorCategoria: [
          { nome: 'Eletrônicos', valor: 15678.90 },
          { nome: 'Móveis', valor: 12345.67 },
          { nome: 'Roupas', valor: 9876.54 },
          { nome: 'Acessórios', valor: 7654.32 }
        ],
        clientesPorStatus: [
          { status: 'Ativos', quantidade: 65 },
          { status: 'Inativos', quantidade: 24 }
        ]
      };

      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const CardEstatistica = ({ titulo, valor, icone, corFundo }: any) => (
    <div className={`${corFundo} rounded-lg p-6 text-white`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
          {icone}
        </div>
        <div>
          <h3 className="text-lg font-medium opacity-90">{titulo}</h3>
          <p className="text-2xl font-semibold mt-1">{valor}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardEstatistica
          titulo="Total de Produtos"
          valor={stats.totalProdutos}
          icone={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          corFundo="bg-blue-500"
        />
        <CardEstatistica
          titulo="Total de Clientes"
          valor={stats.totalClientes}
          icone={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          corFundo="bg-green-500"
        />
        <CardEstatistica
          titulo="Total de Fornecedores"
          valor={stats.totalFornecedores}
          icone={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          corFundo="bg-yellow-500"
        />
        <CardEstatistica
          titulo="Vendas no Mês"
          valor={formataMoeda(stats.vendasMes)}
          icone={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          corFundo="bg-purple-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Dia */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Vendas por Dia</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.vendasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip formatter={(value: any) => formataMoeda(value)} />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#4A90E2" 
                  fill="#4A90E2" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Produtos Mais Vendidos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.produtosMaisVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendas por Categoria */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Vendas por Categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.vendasPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {stats.vendasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formataMoeda(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clientes por Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Clientes por Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.clientesPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {stats.clientesPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 