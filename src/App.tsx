import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from './types';
import { API_CONFIG } from './config';
import { ChatMessage } from './components/ChatMessage';
import { Send, MessageCircle, Sparkles } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // İlk olarak duygu analizi isteği
      const sentimentResponse = await fetch(`${API_CONFIG.baseUrl}/workspace/${API_CONFIG.workspace}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          message: input,
          mode: 'sentiment',
          sessionId: 'sentiment-session'
        })
      });

      const sentimentData: ChatResponse = await sentimentResponse.json();
      
      // Ardından normal sohbet isteği
      const chatResponse = await fetch(`${API_CONFIG.baseUrl}/workspace/${API_CONFIG.workspace}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          message: input,
          mode: 'chat',
          sessionId: 'default-session'
        })
      });

      const chatData: ChatResponse = await chatResponse.json();

      if (chatData.error) {
        throw new Error(chatData.error);
      }

      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, sentiment: sentimentData.sentiment }
          : msg
      ));

      const botMessage: Message = {
        id: chatData.id,
        type: 'bot',
        text: chatData.textResponse,
        timestamp: new Date(),
        sentiment: chatData.sentiment
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Yasamasa
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="flex-1 rounded-2xl shadow-sm mb-4 overflow-hidden bg-white border border-gray-100">
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-280px)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                <MessageCircle className="w-12 h-12 text-blue-500" />
                <p className="text-lg">Merhaba! Size nasıl yardımcı olabilirim?</p>
                <p className="text-sm text-gray-400">Duygu analizi özelliği ile mesajlarınızı analiz edebilirim.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;