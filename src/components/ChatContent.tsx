import { ChatInput } from './ChatInput';
import { MensagemBalao } from './MensagemBalao';

interface Mensagem {
  id: string;
  texto: string;
  horario: string;
  remetente: string;
  tipo: 'texto' | 'imagem' | 'audio';
  conteudo?: string;
  reacoes?: Array<{
    emoji: string;
    quantidade: number;
  }>;
}

const mensagens: Mensagem[] = [
  {
    id: '1',
    texto: 'I added new flows to our design system. Now you can use them for your projects!',
    horario: '09:20',
    remetente: 'Jasmin Lowery',
    tipo: 'texto',
    reacoes: [
      { emoji: '👍', quantidade: 4 }
    ]
  },
  {
    id: '2',
    texto: 'Hey guys! Important news!',
    horario: '09:24',
    remetente: 'Alex Hunt',
    tipo: 'texto'
  },
  {
    id: '3',
    texto: 'Our intern @jchurch has successfully completed his probationary period and is now part of our team!',
    horario: '09:24',
    remetente: 'Alex Hunt',
    tipo: 'texto',
    reacoes: [
      { emoji: '🎉', quantidade: 1 },
      { emoji: '👏', quantidade: 4 }
    ]
  },
  {
    id: '4',
    texto: 'Jaden, my congratulations! I will be glad to work with you on a new project 😊',
    horario: '09:27',
    remetente: 'user',
    tipo: 'texto'
  },
  {
    id: '5',
    tipo: 'imagem',
    conteudo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    horario: '09:30',
    remetente: 'Alex Hunt',
    texto: 'Team meeting'
  },
];

interface ChatContentProps {
  onVoltar?: () => void;
}

export function ChatContent({ onVoltar }: ChatContentProps) {
  return (
    <div className="h-screen flex flex-col bg-[#f5f6f6] w-full">
      {/* Cabeçalho do Chat */}
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Botão Voltar - Visível apenas em mobile */}
          {onVoltar && (
            <button 
              onClick={onVoltar}
              className="md:hidden text-gray-500 hover:text-gray-700 mr-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold">
            DC
          </div>
          <div>
            <h2 className="font-semibold">Design chat</h2>
            <p className="text-sm text-gray-500">23 members, 10 online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <MensagemBalao
            key={mensagem.id}
            {...mensagem}
          />
        ))}
      </div>

      {/* Área de Input */}
      <ChatInput />
    </div>
  );
} 