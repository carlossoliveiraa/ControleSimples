import { useState, useEffect } from 'react';
import { ChatUserList } from '../components/ChatUserList';
import { ChatInput } from '../components/ChatInput';
import { ChatMessages } from '../components/ChatMessages';

interface User {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  status?: 'online' | 'offline';
  ultima_mensagem?: string;
  ultima_mensagem_hora?: string;
}

// Usuários de teste
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Osman Campos',
    email: 'osman@example.com',
    status: 'online',
    ultima_mensagem: 'Olá, como posso ajudar?',
    ultima_mensagem_hora: '10:30'
  },
  {
    id: '2',
    nome: 'Jayden Church',
    email: 'jayden@example.com',
    status: 'offline',
    ultima_mensagem: 'Obrigado pelo suporte!',
    ultima_mensagem_hora: 'Ontem'
  }
];

export function Chat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Simula carregamento de mensagens quando um usuário é selecionado
  useEffect(() => {
    if (selectedUser) {
      // Aqui você pode carregar as mensagens do usuário selecionado
      const mockMessages = [
        {
          id: 1,
          sender: selectedUser.id,
          text: `Olá! Esta é uma mensagem de teste de ${selectedUser.nome}`,
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          sender: 'me',
          text: 'Oi! Como posso ajudar?',
          timestamp: new Date().toISOString(),
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedUser]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedUser) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
  };

  const handleSendFile = (file: File) => {
    if (!selectedUser) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      file: {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      },
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Lista de Usuários */}
      <ChatUserList 
        users={mockUsers}
        onSelectUser={handleSelectUser}
        selectedUserId={selectedUser?.id}
      />

      {/* Área de Chat */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Header do Chat */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <img
              src={selectedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.nome)}&background=random`}
              alt={selectedUser.nome}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                {selectedUser.nome}
              </h2>
              <span className={`text-sm ${
                selectedUser.status === 'online' 
                  ? 'text-green-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {selectedUser.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'me'
                    ? 'bg-[#4A90E2] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.file ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{message.file.name}</span>
                      </div>
                      {message.file.type.startsWith('image/') && (
                        <img
                          src={message.file.url}
                          alt="Imagem enviada"
                          className="max-w-full rounded"
                        />
                      )}
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Selecione um usuário para iniciar uma conversa
            </h3>
          </div>
        </div>
      )}
    </div>
  );
} 