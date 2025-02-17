import { useState } from 'react';

interface User {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  status?: 'online' | 'offline';
  ultima_mensagem?: string;
  ultima_mensagem_hora?: string;
}

interface ChatUserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
}

export function ChatUserList({ users, onSelectUser, selectedUserId }: ChatUserListProps) {
  return (
    <div className="w-full max-w-xs border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Conversas</h2>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-10rem)]">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700
              ${selectedUserId === user.id ? 'bg-gray-50 dark:bg-gray-700' : ''}
            `}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=random`}
                alt={user.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
              {user.status && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 
                  ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              )}
            </div>

            {/* Informações do usuário */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {user.nome}
                </h3>
                {user.ultima_mensagem_hora && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user.ultima_mensagem_hora}
                  </span>
                )}
              </div>
              {user.ultima_mensagem && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.ultima_mensagem}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 