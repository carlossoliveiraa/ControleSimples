interface ConversaItemProps {
  id: string;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  avatar: string;
  online?: boolean;
  naoLidas?: number;
  pinned?: boolean;
}

export function ConversaItem({ 
  nome, 
  ultimaMensagem, 
  horario, 
  avatar, 
  naoLidas, 
  pinned 
}: ConversaItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
      {/* Avatar */}
      <div className="relative">
        {typeof avatar === 'string' && avatar.startsWith('http') ? (
          <img
            src={avatar}
            alt={nome}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white font-semibold">{avatar}</span>
          </div>
        )}
      </div>

      {/* Informações da conversa */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{nome}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">{horario}</span>
            {pinned && (
              <svg className="w-4 h-4 text-[#00a884]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-500 truncate">{ultimaMensagem}</p>
          {naoLidas && (
            <div className="min-w-[18px] h-[18px] bg-[#00a884] rounded-full flex items-center justify-center">
              <span className="text-[11px] text-white font-medium">{naoLidas}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 