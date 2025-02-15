import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../services/clientes';
import type { Cliente, ClienteFormData } from '../types';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import { cpf } from 'cpf-cnpj-validator';
import { FormHeader } from '../components/FormHeader';

export function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    sexo: 'M',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    observacoes: '',
    ativo: true,
    avatar_url: null
  });

  // Data de Nascimento
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  // Gerar arrays para os dropdowns
  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const meses = [
    { valor: '01', nome: 'Janeiro' },
    { valor: '02', nome: 'Fevereiro' },
    { valor: '03', nome: 'Março' },
    { valor: '04', nome: 'Abril' },
    { valor: '05', nome: 'Maio' },
    { valor: '06', nome: 'Junho' },
    { valor: '07', nome: 'Julho' },
    { valor: '08', nome: 'Agosto' },
    { valor: '09', nome: 'Setembro' },
    { valor: '10', nome: 'Outubro' },
    { valor: '11', nome: 'Novembro' },
    { valor: '12', nome: 'Dezembro' }
  ];
  const anoAtual = new Date().getFullYear();
  const anos = Array.from(
    { length: 100 }, 
    (_, i) => (anoAtual - i).toString()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  useEffect(() => {
    if (id) {
      carregarCliente(id);
    }
  }, [id]);

  useEffect(() => {
    if (formData.data_nascimento) {
      const [year, month, day] = formData.data_nascimento.split('-');
      setDia(day);
      setMes(month);
      setAno(year);
    }
  }, [formData.data_nascimento]);

  // Atualiza a data quando os dropdowns mudam
  useEffect(() => {
    if (dia && mes && ano) {
      setFormData(prev => ({
        ...prev,
        data_nascimento: `${ano}-${mes}-${dia}`
      }));
    }
  }, [dia, mes, ano]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar Nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar CPF
    if (formData.cpf && !cpf.isValid(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validar Data de Nascimento
    if (!dia || !mes || !ano) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function carregarCliente(clienteId: string) {
    try {
      const { cliente } = await clienteService.buscarPorId(clienteId);
      if (cliente) {
        setFormData({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          cpf: cliente.cpf,
          data_nascimento: cliente.data_nascimento,
          sexo: cliente.sexo,
          cep: cliente.cep,
          endereco: cliente.endereco,
          numero: cliente.numero,
          bairro: cliente.bairro,
          observacoes: cliente.observacoes || '',
          ativo: cliente.ativo,
          avatar_url: cliente.avatar_url
        });
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar cliente',
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
        await clienteService.atualizar(id, formData);
      } else {
        await clienteService.criar(formData);
      }

      Swal.fire({
        icon: 'success',
        title: id ? 'Cliente atualizado!' : 'Cliente cadastrado!',
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar cliente',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Arquivo muito grande',
        text: 'A foto não pode ter mais que 10MB'
      });
      return;
    }

    try {
      setIsUpdatingAvatar(true);

      // Se já existe um avatar, remover antes de fazer upload do novo
      if (formData.avatar_url) {
        await clienteService.removeAvatar(formData.avatar_url);
      }

      const { url } = await clienteService.uploadAvatar(file);
      
      // Atualizar o avatar no banco imediatamente
      if (id) {
        await clienteService.atualizar(id, { avatar_url: url });
      }

      setFormData(prev => ({ ...prev, avatar_url: url }));

      Swal.fire({
        icon: 'success',
        title: 'Foto atualizada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error: any) {
      console.error('Erro ao atualizar avatar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar foto',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const result = await Swal.fire({
        title: 'Remover foto?',
        text: 'Tem certeza que deseja remover a foto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4A90E2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed && formData.avatar_url) {
        setIsUpdatingAvatar(true);
        
        // Remover do storage
        await clienteService.removeAvatar(formData.avatar_url);
        
        // Atualizar no banco imediatamente
        if (id) {
          await clienteService.atualizar(id, { avatar_url: null });
        }

        setFormData(prev => ({ ...prev, avatar_url: null }));

        Swal.fire({
          icon: 'success',
          title: 'Foto removida com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao remover foto',
        text: 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return (
    <div>
      <FormHeader
        title={id ? 'Editar Cliente' : 'Novo Cliente'}
        subtitle={id ? 'Altere os dados do cliente' : 'Cadastre um novo cliente'}
        backTo="/clientes"
      />

      <main className="bg-white rounded-lg shadow-sm">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna da Esquerda - Avatar */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {formData.avatar_url ? (
                      <>
                        <img
                          src={formData.avatar_url}
                          alt="Foto do cliente"
                          className="w-48 h-48 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={handleAvatarClick}
                        />
                        <div className="absolute hidden group-hover:flex -bottom-2 -right-2 gap-1">
                          <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                            title="Alterar foto"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                            title="Remover foto"
                          >
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div 
                        className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                        onClick={handleAvatarClick}
                      >
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                    {isUpdatingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Clique para adicionar uma foto
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG ou PNG até 10MB
                  </p>
                </div>
              </div>

              {/* Coluna da Direita - Resto do formulário */}
              <div className="lg:col-span-2 space-y-6">
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

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={formData.telefone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    />
                  </div>

                  {/* CPF */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <InputMask
                      mask="999.999.999-99"
                      value={formData.cpf}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                        errors.cpf ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cpf && (
                      <p className="mt-1 text-sm text-red-500">{errors.cpf}</p>
                    )}
                  </div>

                  {/* Data de Nascimento */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <select
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.data_nascimento ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Dia</option>
                        {dias.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>

                      <select
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.data_nascimento ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Mês</option>
                        {meses.map(m => (
                          <option key={m.valor} value={m.valor}>{m.nome}</option>
                        ))}
                      </select>

                      <select
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent ${
                          errors.data_nascimento ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Ano</option>
                        {anos.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    {errors.data_nascimento && (
                      <p className="mt-1 text-sm text-red-500">{errors.data_nascimento}</p>
                    )}
                  </div>

                  {/* Sexo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sexo
                    </label>
                    <select
                      value={formData.sexo}
                      onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value as 'M' | 'F' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
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
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] flex items-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar
                  </>
                )}
              </button>
            </div>

            {/* Botão de remover foto, se houver */}
            {formData.avatar_url && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remover foto
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
} 