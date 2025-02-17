interface ChatMessagesProps {
  messages: Array<{
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  }>;
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm text-gray-900">{message.content}</p>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 