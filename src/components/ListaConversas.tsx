import { useState, useEffect } from 'react';
import { ConversaItem } from './ConversaItem';
import { InfoUsuario } from './InfoUsuario';
import { authService } from '../services/auth';
import type { Usuario } from '../lib/supabase';

interface Conversa {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  avatar: string;
  online?: boolean;
  naoLidas?: number;
  pinned?: boolean;
}

const conversas: Conversa[] = [
  {
    id: '1',
    nome: 'Osman Campos',
    ultimaMensagem: "You: Hey! We are read...",
    horario: '20m',
    avatar: 'https://i.pravatar.cc/150?img=8',
    pinned: true
  },
  {
    id: '2',
    nome: 'Jayden Church',
    ultimaMensagem: 'I prepared some varia...',
    horario: '1h',
    avatar: 'https://i.pravatar.cc/150?img=11',
  }
];

interface ListaConversasProps {
  onConversaSelect: (conversa: Conversa) => void;
}

export function ListaConversas({ onConversaSelect }: ListaConversasProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    const { user } = await authService.getCurrentUser();
    if (user) {
      setUsuario(user);
    }
  }

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (usuario) {
      setUsuario({ ...usuario, avatar_url: newAvatarUrl });
    }
  };

  const handleNameUpdate = (newName: string) => {
    if (usuario) {
      setUsuario({ ...usuario, nome: newName });
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Cabeçalho */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            {usuario && (
              <div 
                className="cursor-pointer"
                onClick={() => setShowUserInfo(!showUserInfo)}
              >
                <InfoUsuario
                  nome={usuario.nome}
                  email={usuario.email}
                  avatar={usuario.avatar_url}
                  userId={usuario.id}
                  onAvatarUpdate={handleAvatarUpdate}
                  onNameUpdate={handleNameUpdate}
                />
              </div>
            )}
          </div>
          
          {/* Botão de nova conversa com tooltip */}
          <div className="flex-shrink-0 relative group">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
              Nova Conversa
            </div>
          </div>
        </div>

        {/* Campo de busca */}
        <div className="bg-[#f5f6f6] rounded-lg p-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar"
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversas.map((conversa) => (
          <div key={conversa.id} onClick={() => onConversaSelect(conversa)}>
            <ConversaItem
              {...conversa}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 