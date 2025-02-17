import { MenuLateral } from '../../components/MenuLateral';
import { HeaderPerfil } from '../../components/HeaderPerfil';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/auth';
import type { Usuario } from '../../types';

export function BaseLayout() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    const { user } = await authService.getCurrentUser();
    if (user) {
      setUsuario(user as Usuario);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Menu Lateral */}
      <MenuLateral />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Botão do Menu (Mobile) */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={menuAberto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Título da Página (pode ser dinâmico) */}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Dashboard
            </h1>

            {/* Área do Perfil (sempre à direita) */}
            <div className="flex items-center gap-4">
              {/* Botão de Tema */}
              <button
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => document.documentElement.classList.toggle('dark')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>

              {/* Perfil */}
              {usuario && (
                <HeaderPerfil 
                  nome={usuario.nome}
                  email={usuario.email}
                  avatar={usuario.avatar_url}
                />
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 