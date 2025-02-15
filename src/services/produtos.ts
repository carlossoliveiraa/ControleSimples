import { supabase } from './supabase';
import type { Produto, ProdutoFormData } from '../types';

export const produtosService = {
  async listar() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categoria:categorias(*)
        `)
        .order('nome');

      if (error) throw error;
      return { produtos: data as Produto[] };
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  async buscarPorId(id: string) {
    try {
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
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  },

  async criar(produto: ProdutoFormData) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([produto])
        .select()
        .single();

      if (error) throw error;
      return { produto: data as Produto };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  async atualizar(id: string, produto: Partial<ProdutoFormData>) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { produto: data as Produto };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  async excluir(id: string) {
    try {
      // Primeiro buscar o produto para pegar a URL da imagem
      const { data: produto, error: getError } = await supabase
        .from('produtos')
        .select('avatar_url')
        .eq('id', id)
        .single();

      if (getError) throw getError;

      // Se tiver imagem, remover do storage
      if (produto?.avatar_url) {
        const path = produto.avatar_url.split('/').pop();
        if (path) {
          await supabase.storage
            .from('avatars')
            .remove([`produtos/${path}`]);
        }
      }

      // Depois excluir o produto
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  },

  async uploadAvatar(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  },

  async removeAvatar(url: string) {
    try {
      const path = url.split('/').pop();
      if (!path) throw new Error('URL inválida');

      const { error } = await supabase.storage
        .from('avatars')
        .remove([`produtos/${path}`]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      throw error;
    }
  }
}; 