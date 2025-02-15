import { ListaConversas } from '../components/ListaConversas';
import { ChatContent } from '../components/ChatContent';
import { useState } from 'react';

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

export function Chat() {
  const [mostrarLista, setMostrarLista] = useState(true);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);

  const handleConversaSelect = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
    setMostrarLista(false);
  };

  return (
    <div className="flex h-screen">
      {/* Lista de Conversas - Visível em telas maiores ou quando selecionada em mobile */}
      <div className={`
        ${mostrarLista ? 'flex' : 'hidden'}
        md:flex
        w-full md:w-[380px] flex-shrink-0
        absolute md:relative
        z-10 md:z-0
        bg-white
      `}>
        <ListaConversas onConversaSelect={handleConversaSelect} />
      </div>

      {/* Área do Chat - Visível em telas maiores ou quando uma conversa está selecionada em mobile */}
      <div className={`
        ${!mostrarLista ? 'flex' : 'hidden'}
        md:flex
        flex-1
        absolute md:relative
        inset-0 md:inset-auto
      `}>
        <ChatContent 
          onVoltar={() => setMostrarLista(true)}
          conversaSelecionada={conversaSelecionada}
        />
      </div>
    </div>
  );
} 