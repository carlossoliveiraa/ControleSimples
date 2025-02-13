interface InfoUsuarioProps {
  nome: string;
  email: string;
  avatar: string;
}

export function InfoUsuario({ nome, email, avatar }: InfoUsuarioProps) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <img
        src={avatar}
        alt="Seu perfil"
        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80"
      />
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{nome}</h3>
        <p className="text-xs text-gray-500 truncate">{email}</p>
      </div>
    </div>
  );
} 