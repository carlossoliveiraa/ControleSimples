interface MensagemBalaoProps {
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

export function MensagemBalao({
  id,
  texto,
  horario,
  remetente,
  tipo,
  conteudo,
  reacoes
}: MensagemBalaoProps) {
  const isUser = remetente === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar do remetente (não-usuário) */}
      {!isUser && (
        <img
          src={`https://i.pravatar.cc/150?img=${parseInt(id) + 10}`}
          alt={remetente}
          className="w-8 h-8 rounded-full self-end mr-2"
        />
      )}

      {/* Balão da mensagem */}
      <div 
        className={`max-w-[70%] ${
          isUser ? 'bg-[#5b96f7] text-white' : 'bg-white'
        } rounded-2xl shadow-sm p-3 border border-gray-100`}
      >
        {/* Nome do remetente (não-usuário) */}
        {!isUser && (
          <p className="text-sm font-semibold text-[#5b96f7] mb-1">{remetente}</p>
        )}
        
        {/* Conteúdo da mensagem */}
        {tipo === 'imagem' && (
          <img
            src={conteudo}
            alt={texto}
            className="rounded-lg mb-2 w-full"
          />
        )}
        
        <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'}`}>
          {texto}
        </p>
        
        {/* Reações e horário */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex -space-x-1">
            {reacoes?.map((reacao, index) => (
              <div 
                key={index} 
                className="bg-white rounded-full px-2 py-0.5 text-xs border shadow-sm flex items-center gap-1"
              >
                <span>{reacao.emoji}</span>
                <span className="text-gray-600">{reacao.quantidade}</span>
              </div>
            ))}
          </div>
          <p className={`text-xs ${isUser ? 'text-white/80' : 'text-gray-500'}`}>
            {horario}
          </p>
        </div>
      </div>

      {/* Avatar do usuário */}
      {isUser && (
        <img
          src="https://i.pravatar.cc/150?img=30"
          alt="You"
          className="w-8 h-8 rounded-full self-end ml-2"
        />
      )}
    </div>
  );
} 