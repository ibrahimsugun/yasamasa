import React from 'react';
import { Message } from '../types';
import { Bot, User, Smile, Frown, Meh } from 'lucide-react';

interface Props {
  message: Message;
}

export function ChatMessage({ message }: Props) {
  const isBot = message.type === 'bot';
  
  const getSentimentIcon = () => {
    if (!message.sentiment) return null;
    
    switch (message.sentiment.toLowerCase()) {
      case 'positive':
        return <Smile size={16} className="text-green-500" />;
      case 'negative':
        return <Frown size={16} className="text-red-500" />;
      case 'neutral':
        return <Meh size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-3 ${isBot ? 'bg-blue-50/50' : ''} p-4 rounded-xl transition-all hover:shadow-sm`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
        isBot 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
      }`}>
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium text-gray-700">
            {isBot ? 'Bot' : 'Siz'}
          </p>
          {message.sentiment && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white shadow-sm border border-gray-100">
              {getSentimentIcon()}
              <span className="text-xs text-gray-600 capitalize">
                {message.sentiment}
              </span>
            </div>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {message.timestamp.toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-gray-800 leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}