import { supabase } from './supabase';
import type { Cliente, ClienteFormData } from '../types';

export const clienteService = {
  async listar() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { clientes: data as Cliente[] };
  },

  async criar(cliente: ClienteFormData) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{ ...cliente, created_at: new Date(), updated_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    return { cliente: data as Cliente };
  },

  async atualizar(id: string, cliente: Partial<ClienteFormData>) {
    const { data, error } = await supabase
      .from('clientes')
      .update({ ...cliente, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { cliente: data as Cliente };
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async uploadAvatar(file: File) {
    try {
      // Validar tamanho
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('A foto não pode ter mais que 10MB');
      }

      // Validar tipo
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Apenas imagens JPG e PNG são permitidas');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `clientes/${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Gerar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error: any) {
      console.error('Erro no upload:', error);
      throw new Error(error.message || 'Erro ao fazer upload da foto');
    }
  },

  async removeAvatar(avatarUrl: string) {
    try {
      // Extrair o caminho do arquivo da URL
      const filePathMatch = avatarUrl.match(/avatars\/clientes\/(.*)/);
      if (!filePathMatch) return;

      const filePath = `clientes/${filePathMatch[1]}`;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      throw new Error(error.message || 'Erro ao remover foto');
    }
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { cliente: data as Cliente };
  }
}; 