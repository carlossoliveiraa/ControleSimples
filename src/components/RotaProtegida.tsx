import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../services/auth';
import Swal from 'sweetalert2';
import { useAuthStore } from '../stores/authStore';

export function RotaProtegida() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    verificarAutenticacao();
    
    // Verificar a cada 5 minutos
    const interval = setInterval(verificarAutenticacao, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function verificarAutenticacao() {
    try {
      const session = await authService.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Sessão não encontrada');
      }

      const { user, error } = await authService.getCurrentUser();
      if (error || !user) {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Usuário não autenticado');
      }

      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      
      if (location.pathname !== '/login') {
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
} 