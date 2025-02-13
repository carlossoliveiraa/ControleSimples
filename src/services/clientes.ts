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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('clientes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('clientes')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
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