import { ChatInput } from './ChatInput';
import { MensagemBalao } from './MensagemBalao';

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

interface ChatContentProps {
  onVoltar: () => void;
  conversaSelecionada: Conversa | null;
}

interface MensagemBalaoProps {
  id: string;
  texto: string;
  horario: string;
  remetente: string;
  tipo: "audio" | "texto" | "imagem" | "documento";
}

const mensagensOsman = [
  {
    id: '1',
    texto: 'Hey! We are ready to start the project.',
    horario: '09:20',
    remetente: 'Osman Campos',
    tipo: 'texto'
  },
  {
    id: '2',
    texto: 'Great! I have some ideas to share.',
    horario: '09:24',
    remetente: 'user',
    tipo: 'texto'
  }
];

const mensagensJayden = [
  {
    id: '1',
    texto: 'I prepared some variations for the new design.',
    horario: '09:20',
    remetente: 'Jayden Church',
    tipo: 'texto'
  },
  {
    id: '2',
    texto: 'They look amazing! Can we schedule a call?',
    horario: '09:24',
    remetente: 'user',
    tipo: 'texto'
  }
];

export function ChatContent({ onVoltar, conversaSelecionada }: ChatContentProps) {
  if (!conversaSelecionada) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Selecione uma conversa para começar</p>
      </div>
    );
  }

  const mensagens = conversaSelecionada.id === '1' ? mensagensOsman : mensagensJayden;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header do Chat */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <img
            src={conversaSelecionada.avatar}
            alt={conversaSelecionada.nome}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{conversaSelecionada.nome}</h2>
            <p className="text-sm text-gray-500">online</p>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => (
          <MensagemBalao
            key={mensagem.id}
            {...mensagem}
            tipo={mensagem.tipo as "audio" | "texto" | "imagem" | "documento"}
          />
        ))}
      </div>

      {/* Área de Input */}
      <ChatInput onSendMessage={(message) => {
        // Implemente a lógica de envio
        console.log('Mensagem enviada:', message);
      }} />
    </div>
  );
} 