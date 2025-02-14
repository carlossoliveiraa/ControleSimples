import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fornecedorService } from '../services/fornecedores';
import type { Fornecedor, FornecedorFormData } from '../types';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import { cnpj } from 'cpf-cnpj-validator';

export function EditarFornecedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
    site: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    observacoes: '',
    ativo: true
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar Nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Validar Telefone
    if (!formData.telefone.replace(/\D/g, '')) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    // Validar CNPJ (opcional)
    if (formData.cnpj && !cnpj.isValid(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    // Validar Site (opcional)
    if (formData.site && !formData.site.startsWith('http')) {
      newErrors.site = 'Site deve começar com http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (id) {
      carregarFornecedor(id);
    }
  }, [id]);

  async function carregarFornecedor(fornecedorId: string) {
    try {
      const { fornecedor } = await fornecedorService.buscarPorId(fornecedorId);
      if (fornecedor) {
        setFormData({
          nome: fornecedor.nome,
          email: fornecedor.email,
          telefone: fornecedor.telefone,
          cnpj: fornecedor.cnpj,
          site: fornecedor.site,
          cep: fornecedor.cep,
          endereco: fornecedor.endereco,
          numero: fornecedor.numero,
          bairro: fornecedor.bairro,
          observacoes: fornecedor.observacoes || '',
          ativo: fornecedor.ativo
        });
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar fornecedor',
        text: 'Tente novamente mais tarde'
      });
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de validação',
        text: 'Por favor, corrija os erros no formulário'
      });
      return;
    }

    setIsLoading(true);

    try {
      if (id) {
        await fornecedorService.atualizar(id, formData);
      } else {
        await fornecedorService.criar(formData);
      }

      Swal.fire({
        icon: 'success',
        title: id ? 'Fornecedor atualizado!' : 'Fornecedor cadastrado!',
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/fornecedores');
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar fornecedor',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                {id ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
                  )}
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={formData.telefone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                      errors.telefone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-500">{errors.telefone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ
                  </label>
                  <InputMask
                    mask="99.999.999/9999-99"
                    value={formData.cnpj}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                      errors.cnpj ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cnpj && (
                    <p className="mt-1 text-sm text-red-500">{errors.cnpj}</p>
                  )}
                </div>

                {/* Site */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site
                  </label>
                  <input
                    type="url"
                    value={formData.site}
                    onChange={(e) => setFormData(prev => ({ ...prev, site: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                      errors.site ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://"
                  />
                  {errors.site && (
                    <p className="mt-1 text-sm text-red-500">{errors.site}</p>
                  )}
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.ativo ? 'ativo' : 'inativo'}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'ativo' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Observações */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                />
              </div>

              {/* Botões */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/fornecedores')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 