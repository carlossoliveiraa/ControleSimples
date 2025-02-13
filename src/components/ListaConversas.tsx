import { ConversaItem } from './ConversaItem';
import { InfoUsuario } from './InfoUsuario';

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
    nome: 'Design chat',
    ultimaMensagem: 'Jessie Rollins sent...',
    horario: '4m',
    avatar: 'DC',
    naoLidas: 1,
    pinned: true
  },
  {
    id: '2',
    nome: 'Osman Campos',
    ultimaMensagem: "You: Hey! We are read...",
    horario: '20m',
    avatar: 'https://i.pravatar.cc/150?img=8',
    pinned: true
  },
  {
    id: '3',
    nome: 'Jayden Church',
    ultimaMensagem: 'I prepared some varia...',
    horario: '1h',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '4',
    nome: 'Jacob Mcleod',
    ultimaMensagem: 'And send me the proto...',
    horario: '10m',
    avatar: 'https://i.pravatar.cc/150?img=12',
    naoLidas: 1
  },
  {
    id: '5',
    nome: 'Jasmin Lowery',
    ultimaMensagem: "You: Ok! Let's discuss it on th...",
    horario: '20m',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    nome: 'Zaid Myers',
    ultimaMensagem: 'You: Hey! We are ready to in...',
    horario: '45m',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: '7',
    nome: 'Anthony Cordanes',
    ultimaMensagem: 'What do you think?',
    horario: '1d',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: '8',
    nome: 'Connar Garcia',
    ultimaMensagem: 'You: I think it would be perfe...',
    horario: '2d',
    avatar: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: '9',
    nome: 'Vanessa Cox',
    ultimaMensagem: 'Voice message',
    horario: '2d',
    avatar: 'https://i.pravatar.cc/150?img=23',
  }
];

interface ListaConversasProps {
  onConversaSelect?: () => void;
}

export function ListaConversas({ onConversaSelect }: ListaConversasProps) {
  return (
    <div className="h-screen flex flex-col bg-white border-r border-gray-200 w-full">
      {/* Cabeçalho */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {/* Informações do usuário */}
          <InfoUsuario
            nome="João Silva"
            email="joao.silva@email.com"
            avatar="https://i.pravatar.cc/150?img=30"
          />
          
          {/* Botão de nova conversa com tooltip */}
          <div className="relative group">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
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
          <div key={conversa.id} onClick={onConversaSelect}>
            <ConversaItem
              {...conversa}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 