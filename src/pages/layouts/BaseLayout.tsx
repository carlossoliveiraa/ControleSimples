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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Menu Lateral para Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <MenuLateral />
      </div>

      {/* Menu Lateral Mobile */}
      {menuAberto && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMenuAberto(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50 lg:hidden">
            <MenuLateral onClose={() => setMenuAberto(false)} />
          </div>
        </>
      )}

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Botão do menu mobile */}
            <button
              onClick={() => setMenuAberto(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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