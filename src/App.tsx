import { useState, FormEvent } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { Chat } from './pages/Chat'
import { authService } from './services/auth'
import { RotaProtegida } from './components/RotaProtegida'
import Swal from 'sweetalert2'
import './App.css'
import { EditarPerfil } from './pages/EditarPerfil'
import { Principal } from './pages/Principal'
import { Clientes } from './pages/Clientes'
import { Menus } from './pages/layouts/Menus'
import { EditarCliente } from './pages/EditarCliente'
import { Fornecedores } from './pages/Fornecedores'
import { EditarFornecedor } from './pages/EditarFornecedor'
import { Produtos } from './pages/Produtos'
import { EditarProduto } from './pages/EditarProduto'
import { Categorias } from './pages/Categorias'
import { RecuperarSenha } from './pages/RecuperarSenha'
import { BaseLayout } from './pages/layouts/BaseLayout'
import { Transacoes } from './pages/Transacoes'
import { Entradas } from './pages/transacoes/Entradas'
import { Saidas } from './pages/transacoes/Saidas'
import { Inventario } from './pages/transacoes/Inventario'
import { useAuthStore } from './stores/authStore'
import { CadastroCategoria } from './pages/CadastroCategoria'
import { HeaderPerfil } from './components/HeaderPerfil'

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated, setUser } = useAuthStore();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validações
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    setError(null);

    if (!validateEmail(email)) {
      setError('Email inválido');
      return false;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!isLogin) {
      if (!nome.trim()) {
        setError('Nome é obrigatório');
        return false;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { session, user } = await authService.signIn({ email, password });
      
      if (session && user) {
        setIsAuthenticated(true);
        setUser(user);
        
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      } else {
        throw new Error('Erro ao fazer login. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
      setIsAuthenticated(false);
      setUser(null);
      
      Swal.fire({
        icon: 'error',
        title: 'Ops! Algo deu errado',
        text: err.message || 'Ocorreu um erro. Tente novamente.',
        confirmButtonColor: '#4A90E2'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Login/Cadastro */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#4A90E2] rounded-lg flex items-center justify-center mb-2">
              <span className="text-white text-xl font-bold">CS</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold text-[#4A90E2]">Controle Simples</h1>
          </div>

          <h2 className="text-2xl font-semibold text-[#4A90E2] mb-6">
            {isLogin ? 'Faça seu login' : 'Crie sua conta'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#4A90E2] mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A90E2] text-sm"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-[#4A90E2] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A90E2] text-sm"
                  placeholder="Digite seu email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#4A90E2] mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A90E2] text-sm"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-[#4A90E2] mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A90E2] text-sm"
                    placeholder="Digite sua senha novamente"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/recuperar-senha')}
                    className="font-medium text-[#4A90E2] hover:text-[#357ABD]"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#4A90E2] text-white py-2.5 rounded font-medium hover:bg-[#357ABD] transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-sm text-[#4A90E2] hover:underline"
              >
                {isLogin ? 'Criar uma nova conta' : 'Já tenho uma conta'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Imagem */}
      <div className="hidden lg:block lg:w-1/2 bg-[#4A90E2]">
        <div className="h-full flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <img             
              src="https://img.freepik.com/free-vector/flat-people-business-training_23-2148905954.jpg"
              alt="Modern Dashboard Interface"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          {/* Rotas protegidas com layout base */}
          <Route element={<RotaProtegida />}>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Principal />} />
              <Route path="/perfil" element={<EditarPerfil />} />
              <Route path="/chat" element={<Chat />} />
              
              {/* Rotas de Transações */}
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/transacoes/entradas" element={<Entradas />} />
              <Route path="/transacoes/saidas" element={<Saidas />} />
              <Route path="/transacoes/inventario" element={<Inventario />} />
              
              {/* Outras rotas */}
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<EditarCliente />} />
              <Route path="/clientes/:id" element={<EditarCliente />} />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/fornecedores/novo" element={<EditarFornecedor />} />
              <Route path="/fornecedores/:id" element={<EditarFornecedor />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/novo" element={<EditarProduto />} />
              <Route path="/produtos/:id" element={<EditarProduto />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/nova" element={<CadastroCategoria />} />
              <Route path="/categorias/:id" element={<CadastroCategoria />} />
            </Route>
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
