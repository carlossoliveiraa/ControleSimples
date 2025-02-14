import { supabase } from './supabase';
import type { Produto, ProdutoFormData } from '../types';

export const produtoService = {
  async listar() {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .order('nome');

    if (error) throw error;
    return { produtos: data as Produto[] };
  },

  async criar(produto: ProdutoFormData) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single();

    if (error) throw error;
    return { produto: data as Produto };
  },

  async atualizar(id: string, produto: Partial<ProdutoFormData>) {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias(*)
      `)
      .single();

    if (error) throw error;
    return { produto: data as Produto };
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { produto: data as Produto };
  },

  async uploadAvatar(file: File) {
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('A foto não pode ter mais que 10MB');
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Apenas imagens JPG e PNG são permitidas');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

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
      const filePathMatch = avatarUrl.match(/avatars\/produtos\/(.*)/);
      if (!filePathMatch) return;

      const filePath = `produtos/${filePathMatch[1]}`;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      throw new Error(error.message || 'Erro ao remover foto');
    }
  }
}; 