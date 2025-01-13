import React from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex gap-2 max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-blue-100' : 'bg-purple-100'
        }`}>
          {isBot ? <Bot className="w-5 h-5 text-blue-600" /> : <User className="w-5 h-5 text-purple-600" />}
        </div>
        <div className={`rounded-2xl px-4 py-2 ${
          isBot ? 'bg-blue-50 text-gray-800' : 'bg-purple-50 text-gray-800'
        }`}>
          <p className="text-sm">{message.text}</p>
          {message.sentiment && (
            <span className="text-xs text-gray-500 mt-1 block">
              Duygu: {message.sentiment}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};