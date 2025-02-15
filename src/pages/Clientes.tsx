import { useState, useEffect } from 'react';
import { clienteService } from '../services/clientes';
import type { Cliente } from '../types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const { clientes } = await clienteService.listar();
      setClientes(clientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar clientes',
        text: 'Tente novamente mais tarde'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não poderá ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4A90E2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await clienteService.excluir(id);
        await carregarClientes();
        Swal.fire('Excluído!', 'Cliente excluído com sucesso.', 'success');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao excluir cliente',
        text: 'Tente novamente mais tarde'
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800">Clientes</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/clientes/novo')}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">Nome</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Telefone</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {cliente.avatar_url ? (
                            <img
                              src={cliente.avatar_url}
                              alt={cliente.nome}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-600">
                                {cliente.nome.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-900">{cliente.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cliente.telefone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          cliente.ativo
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {cliente.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/clientes/${cliente.id}`)}
                            className="text-gray-400 hover:text-[#4A90E2] transition-colors"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Formulário */}
      {showForm && (
        <ClienteForm
          cliente={selectedCliente}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            carregarClientes();
          }}
        />
      )}
    </div>
  );
} 