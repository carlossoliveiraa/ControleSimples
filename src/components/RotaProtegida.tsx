import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import type { Usuario } from '../lib/supabase';

interface RotaProtegidaProps {
  children: React.ReactNode;
}

export function RotaProtegida({ children }: RotaProtegidaProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verificarAutenticacao() {
      const { user, error } = await authService.getCurrentUser();
      if (error || !user) {
        navigate('/login');
      }
      setIsLoading(false);
    }

    verificarAutenticacao();
  }, [navigate]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
} 