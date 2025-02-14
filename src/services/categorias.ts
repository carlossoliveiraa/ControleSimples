import { supabase } from './supabase';
import type { Categoria, CategoriaFormData } from '../types';

export const categoriaService = {
  async listar() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome');

    if (error) throw error;
    return { categorias: data as Categoria[] };
  },

  async criar(categoria: CategoriaFormData) {
    const { data, error } = await supabase
      .from('categorias')
      .insert([categoria])
      .select()
      .single();

    if (error) throw error;
    return { categoria: data as Categoria };
  },

  async atualizar(id: string, categoria: Partial<CategoriaFormData>) {
    const { data, error } = await supabase
      .from('categorias')
      .update(categoria)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { categoria: data as Categoria };
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { categoria: data as Categoria };
  }
}; 