import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../services/clientes';
import type { Cliente, ClienteFormData } from '../types';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import { cpf } from 'cpf-cnpj-validator';

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">
                {id ? 'Editar Cliente' : 'Novo Cliente'}
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

              {/* Botões */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/clientes')}
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