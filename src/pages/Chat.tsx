import { ListaConversas } from '../components/ListaConversas';
import { ChatContent } from '../components/ChatContent';
import { useState } from 'react';

export function Chat() {
  const [mostrarLista, setMostrarLista] = useState(true);

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
        <ListaConversas onConversaSelect={() => setMostrarLista(false)} />
      </div>

      {/* Área do Chat - Visível em telas maiores ou quando uma conversa está selecionada em mobile */}
      <div className={`
        ${!mostrarLista ? 'flex' : 'hidden'}
        md:flex
        flex-1
        absolute md:relative
        inset-0 md:inset-auto
      `}>
        <ChatContent onVoltar={() => setMostrarLista(true)} />
      </div>
    </div>
  );
} 