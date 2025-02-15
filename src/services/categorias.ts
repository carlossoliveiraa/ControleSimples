import { supabase } from './supabase';
import type { Categoria, CategoriaFormData } from '../types';

export const categoriasService = {
  async getAll(onlyActive: boolean = false) {
    try {
      let query = supabase
        .from('categorias')
        .select('*')
        .order('nome');

      if (onlyActive) {
        query = query.eq('ativa', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
  },

  async create(categoria: CategoriaFormData) {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .insert([{
          nome: categoria.nome,
          descricao: categoria.descricao,
          cor: categoria.cor,
          ativa: categoria.ativa ?? true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  async update(id: string, categoria: Partial<CategoriaFormData>) {
    try {
      const updateData = {
        nome: categoria.nome,
        descricao: categoria.descricao,
        cor: categoria.cor,
        ativa: categoria.ativa
      };

      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const { data, error } = await supabase
        .from('categorias')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
  }
}; 