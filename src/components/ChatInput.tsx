import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
}

export function ChatInput({ onSendMessage, onSendFile }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Implementação própria do useClickAway
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsEmojiPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileSelect = (type: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type;
      fileInputRef.current.click();
    }
    setIsDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendFile) {
      onSendFile(file);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const attachmentOptions = [
    {
      label: 'Enviar Imagem',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      type: 'image/*'
    },
    {
      label: 'Enviar Vídeo',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      type: 'video/*'
    },
    {
      label: 'Enviar Documento',
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      type: '.pdf,.doc,.docx,.txt'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Input de arquivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Botão de anexo com dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Dropdown de opções */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            {attachmentOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleFileSelect(option.type)}
                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors cursor-pointer"
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Emoji picker */}
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {isEmojiPickerOpen && (
          <div className="absolute bottom-full right-0 mb-2">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              theme={document.documentElement.classList.contains('dark') ? 'dark' as Theme : 'light' as Theme}
            />
          </div>
        )}
      </div>

      {/* Campo de mensagem */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 mx-4 p-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:border-[#4A90E2] dark:text-white"
      />

      {/* Botão enviar */}
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-2 text-[#4A90E2] hover:text-[#357ABD] dark:text-[#4A90E2] dark:hover:text-[#357ABD] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
} 