import { MenuLateral } from '../../components/MenuLateral';
import { HeaderPerfil } from '../../components/HeaderPerfil';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../../services/auth';
import type { Usuario } from '../../types';

export function BaseLayout() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      {/* Menu Lateral Fixo */}
      <MenuLateral />

      {/* Área Principal */}
      <div className="ml-[280px]"> {/* Margem para compensar o menu lateral fixo */}
        {/* Header Fixo */}
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-50">
          {usuario && (
            <HeaderPerfil 
              nome={usuario.nome}
              email={usuario.email}
              avatar={usuario.avatar_url}
            />
          )}
        </header>

        {/* Conteúdo Principal */}
        <main className="pt-16"> {/* Padding top para compensar o header fixo */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 