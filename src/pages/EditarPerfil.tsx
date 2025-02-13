import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import type { Usuario } from '../types';
import Swal from 'sweetalert2';

export function EditarPerfil() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [configuracoes, setConfiguracoes] = useState({
    idioma: 'pt-BR'
  });
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    carregarUsuario();
  }, []);

  // Função para converter data string para dia/mês/ano
  const splitData = (data: string) => {
    if (!data) return { dia: '', mes: '', ano: '' };
    const [ano, mes, dia] = data.split('-');
    return { dia, mes, ano };
  };

  // Função para combinar dia/mês/ano em data string
  const combineData = (dia: string, mes: string, ano: string) => {
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  const carregarUsuario = async () => {
    const { user } = await authService.getCurrentUser();
    if (user) {
      setUsuario(user);
      setNome(user.nome);
      setEmail(user.email);
      setTelefone(user.telefone || '');
      setDescricao(user.descricao || '');
      
      const { dia, mes, ano } = splitData(user.data_nascimento || '');
      setDia(dia);
      setMes(mes);
      setAno(ano);
      
      setConfiguracoes({
        idioma: 'pt-BR'
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!usuario) return;

      const data_nascimento = combineData(dia, mes, ano);

      const { error } = await authService.updateProfile(usuario.id, {
        nome,
        telefone,
        descricao,
        data_nascimento: data_nascimento || null,
        configuracoes
      });

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Perfil atualizado!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });

      navigate('/chat');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar perfil',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    try {
      setIsUpdatingAvatar(true);
      const { publicUrl, error } = await authService.updateAvatar(usuario.id, file);
      
      if (error) throw error;
      if (publicUrl) {
        setUsuario(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Foto atualizada!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
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
    if (!usuario) return;

    try {
      const result = await Swal.fire({
        title: 'Remover foto?',
        text: 'Tem certeza que deseja remover sua foto de perfil?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00a884',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setIsUpdatingAvatar(true);
        const { error } = await authService.removeAvatar(usuario.id);
        
        if (error) throw error;
        
        setUsuario(prev => prev ? { ...prev, avatar_url: null } : null);
        
        await Swal.fire({
          icon: 'success',
          title: 'Foto removida!',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao remover foto',
        text: error.message || 'Por favor, tente novamente.',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // Gerar arrays para os dropdowns
  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Cabeçalho */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Editar Perfil</h1>
              <button
                onClick={() => navigate('/chat')}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

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
                    {usuario?.avatar_url ? (
                      <>
                        <img
                          src={usuario.avatar_url}
                          alt="Seu perfil"
                          className="w-32 h-32 rounded-full object-cover cursor-pointer hover:opacity-80"
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
                        className="w-32 h-32 rounded-full bg-[#00a884] flex items-center justify-center cursor-pointer hover:opacity-80"
                        onClick={handleAvatarClick}
                      >
                        <span className="text-white text-4xl font-semibold">
                          {usuario?.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {isUpdatingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Clique na foto para alterar
                  </p>
                </div>
              </div>

              {/* Coluna da Direita - Formulário */}
              <div className="lg:col-span-2 space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    required
                  />
                </div>

                {/* Email - Desabilitado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    placeholder="+55 (11) 98765-4321"
                  />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={dia}
                      onChange={(e) => setDia(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    >
                      <option value="">Dia</option>
                      {dias.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <select
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    >
                      <option value="">Mês</option>
                      {meses.map(m => (
                        <option key={m.valor} value={m.valor}>
                          {m.nome}
                        </option>
                      ))}
                    </select>

                    <select
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    >
                      <option value="">Ano</option>
                      {anos.map(a => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                    placeholder="Fale um pouco sobre você..."
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`
                  px-4 py-2 bg-[#00a884] text-white rounded-md hover:bg-[#008f6f] 
                  focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:ring-offset-2
                  ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 