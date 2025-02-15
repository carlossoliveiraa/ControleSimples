import { useState, useEffect } from 'react';
import { HeaderPerfil } from '../components/HeaderPerfil';
import { authService } from '../services/auth';
import type { Usuario } from '../types';

interface CardProps {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
    percentage: string;
  };
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: CardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-gray-400">{icon}</div>
      <span className="text-gray-600">{title}</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-2xl font-semibold">{value}</h3>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-sm ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change.isPositive ? '+' : ''}{change.value}
          </span>
          <span className="text-gray-400 text-sm">que no mês anterior</span>
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-sm ${change.isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
        {change.isPositive ? '↑' : '↓'} {change.percentage}
      </div>
    </div>
  </div>
);

export function Principal() {
  const [selectedPeriod, setSelectedPeriod] = useState('yearly');
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    async function carregarUsuario() {
      const { user } = await authService.getCurrentUser();
      if (user) {
        setUsuario(user);
      }
    }
    carregarUsuario();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">Dashboard</span>
            </div>     
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Ganhos"
            value="R$ 928,41"
            change={{ value: "R$ 118,8", isPositive: true, percentage: "12.8%" }}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          <StatCard
            title="Gastos"
            value="R$ 169,43"
            change={{ value: "R$ 5,2", isPositive: false, percentage: "3.1%" }}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>}
          />
          <StatCard
            title="Economia"
            value="R$ 406,27"
            change={{ value: "R$ 33,3", isPositive: true, percentage: "8.2%" }}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>}
          />
          <StatCard
            title="Investimento"
            value="R$ 1.854,08"
            change={{ value: "R$ 78,5", isPositive: true, percentage: "9.2%" }}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Estatísticas</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4A90E2]"></span>
                  <span className="text-sm text-gray-600">Ganhos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E5E7EB]"></span>
                  <span className="text-sm text-gray-600">Gastos</span>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                >
                  <option value="yearly">Anual</option>
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
            </div>
            <div className="h-64 w-full">
              {/* Aqui você pode integrar sua biblioteca de gráficos preferida */}
              <div className="w-full h-full bg-gray-50 rounded flex items-center justify-center text-gray-400">
                Área do Gráfico
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Economia Total</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <h4 className="text-3xl font-semibold">R$ 406,27</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm">↑ 8.2%</span>
                <span className="text-gray-400 text-sm">que no mês anterior</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Dream Studio</span>
                  <span className="text-sm text-gray-900">R$ 251,9/R$ 750</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4A90E2] h-2 rounded-full" style={{ width: '33.6%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Educação</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">83%</span>
                    <span className="text-sm text-gray-400">R$ 200</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4A90E2] h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Saúde</span>
                  <span className="text-sm text-gray-900">R$ 30,8/R$ 150</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4A90E2] h-2 rounded-full" style={{ width: '20.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Últimas Transações</h3>
              <button className="text-[#4A90E2] hover:text-[#357ABD] text-sm font-medium">
                Ver todas
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">De/Para</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Descrição</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        EA
                      </div>
                      <span className="text-sm">Elevate Agency</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">2 Out 2023</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Salário mensal</td>
                  <td className="px-6 py-4 text-sm text-green-500">+R$ 1.500,00</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-sm text-green-700 bg-green-50 rounded-full">
                      Sucesso
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 