import { useState, useEffect } from 'react';
import { configuracoesService } from '../services/configuracoes';
import Swal from 'sweetalert2';
import { useTheme } from '../contexts/ThemeContext';

interface ConfiguracoesUsuario {
  tema: 'light' | 'dark';
  notificacoes: boolean;
  emails_marketing: boolean;
  idioma: string;
  formato_data: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  formato_moeda: 'BRL' | 'USD' | 'EUR';
  estoque_minimo_alerta: number;
}

export function Configuracoes() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [configs, setConfigs] = useState<ConfiguracoesUsuario>({
    tema: 'light',
    notificacoes: true,
    emails_marketing: false,
    idioma: 'pt-BR',
    formato_data: 'dd/MM/yyyy',
    formato_moeda: 'BRL',
    estoque_minimo_alerta: 10
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  async function carregarConfiguracoes() {
    try {
      setIsLoading(true);
      const data = await configuracoesService.obterConfiguracoes();
      setConfigs(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar configurações',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function salvarConfiguracoes() {
    try {
      setIsLoading(true);
      await configuracoesService.salvarConfiguracoes(configs);
      Swal.fire({
        icon: 'success',
        title: 'Configurações salvas!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar configurações',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleTemaChange = (novoTema: 'light' | 'dark') => {
    setConfigs(prev => ({ ...prev, tema: novoTema }));
    toggleTheme(novoTema);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Configurações
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Aparência */}
            <section>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Aparência
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Tema
                  </label>
                  <select
                    value={configs.tema}
                    onChange={(e) => handleTemaChange(e.target.value as 'light' | 'dark')}
                    className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-gray-700 dark:text-white"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Idioma
                  </label>
                  <select
                    value={configs.idioma}
                    onChange={(e) => setConfigs(prev => ({ ...prev, idioma: e.target.value }))}
                    className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-gray-700 dark:text-white"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Preferências */}
            <section>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Preferências
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Formato de Data
                  </label>
                  <select
                    value={configs.formato_data}
                    onChange={(e) => setConfigs(prev => ({ ...prev, formato_data: e.target.value as any }))}
                    className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-gray-700 dark:text-white"
                  >
                    <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                    <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                    <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Formato de Moeda
                  </label>
                  <select
                    value={configs.formato_moeda}
                    onChange={(e) => setConfigs(prev => ({ ...prev, formato_moeda: e.target.value as any }))}
                    className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-gray-700 dark:text-white"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Alerta de Estoque Mínimo (%)
                  </label>
                  <input
                    type="number"
                    value={configs.estoque_minimo_alerta}
                    onChange={(e) => setConfigs(prev => ({ ...prev, estoque_minimo_alerta: Number(e.target.value) }))}
                    min="1"
                    max="100"
                    className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] text-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Notificações */}
            <section>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
                Notificações
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notificacoes"
                    checked={configs.notificacoes}
                    onChange={(e) => setConfigs(prev => ({ ...prev, notificacoes: e.target.checked }))}
                    className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded"
                  />
                  <label htmlFor="notificacoes" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Receber notificações do sistema
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emails"
                    checked={configs.emails_marketing}
                    onChange={(e) => setConfigs(prev => ({ ...prev, emails_marketing: e.target.checked }))}
                    className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded"
                  />
                  <label htmlFor="emails" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Receber emails de novidades e promoções
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Botão Salvar */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={salvarConfiguracoes}
              disabled={isLoading}
              className="px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 