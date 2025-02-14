import { supabase } from './supabase';
import type { Fornecedor, FornecedorFormData } from '../types';

export const fornecedorService = {
  async listar() {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { fornecedores: data as Fornecedor[] };
  },

  async criar(fornecedor: FornecedorFormData) {
    const { data, error } = await supabase
      .from('fornecedores')
      .insert([{ ...fornecedor, created_at: new Date(), updated_at: new Date() }])
      .select()
      .single();

    if (error) throw error;
    return { fornecedor: data as Fornecedor };
  },

  async atualizar(id: string, fornecedor: Partial<FornecedorFormData>) {
    const { data, error } = await supabase
      .from('fornecedores')
      .update({ ...fornecedor, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { fornecedor: data as Fornecedor };
  },

  async excluir(id: string) {
    const { error } = await supabase
      .from('fornecedores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async buscarPorId(id: string) {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { fornecedor: data as Fornecedor };
  }
}; 