import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

interface HeaderPerfilProps {
  nome: string;
  email: string;
  avatar: string | null;
}

export function HeaderPerfil({ nome, email, avatar }: HeaderPerfilProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const primeiraLetra = nome.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="relative">
      {/* Botão do Perfil */}
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Seu perfil"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center">
            <span className="text-white font-semibold">{primeiraLetra}</span>
          </div>
        )}
        <span className="text-sm text-gray-600">{email}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Overlay para fechar o dropdown ao clicar fora */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white border border-gray-100 shadow-lg shadow-gray-100/50 z-20">
            <div className="py-1">
              {/* Editar Perfil */}
              <button
                onClick={() => navigate('/perfil')}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Editar perfil
              </button>

              {/* Botão Sair */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 