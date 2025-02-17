import { supabase } from './supabase';

interface ConfiguracoesUsuario {
  tema: 'light' | 'dark';
  notificacoes: boolean;
  emails_marketing: boolean;
  idioma: string;
  formato_data: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  formato_moeda: 'BRL' | 'USD' | 'EUR';
  estoque_minimo_alerta: number;
}

export const configuracoesService = {
  async obterConfiguracoes(): Promise<ConfiguracoesUsuario> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('usuarios')
        .select('configuracoes')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data?.configuracoes || {
        tema: 'light',
        notificacoes: true,
        emails_marketing: false,
        idioma: 'pt-BR',
        formato_data: 'dd/MM/yyyy',
        formato_moeda: 'BRL',
        estoque_minimo_alerta: 10
      };
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      throw error;
    }
  },

  async salvarConfiguracoes(configs: ConfiguracoesUsuario): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('usuarios')
        .update({ 
          configuracoes: configs,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
  }
}; 