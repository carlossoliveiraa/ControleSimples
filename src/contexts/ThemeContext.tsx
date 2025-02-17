import { createContext, useContext, useEffect, useState } from 'react';
import { configuracoesService } from '../services/configuracoes';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: (newTheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    carregarTema();
  }, []);

  async function carregarTema() {
    try {
      const configs = await configuracoesService.obterConfiguracoes();
      setTheme(configs.tema);
      aplicarTema(configs.tema);
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  }

  const toggleTheme = async (newTheme: 'light' | 'dark') => {
    try {
      const configs = await configuracoesService.obterConfiguracoes();
      await configuracoesService.salvarConfiguracoes({
        ...configs,
        tema: newTheme
      });
      setTheme(newTheme);
      aplicarTema(newTheme);
    } catch (error) {
      console.error('Erro ao alterar tema:', error);
    }
  };

  const aplicarTema = (tema: 'light' | 'dark') => {
    if (tema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 