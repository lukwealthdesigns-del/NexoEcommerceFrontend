import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { aiService } from '../../services/ai_assistant';
import toast from 'react-hot-toast';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadChatHistory();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const history = await aiService.getChatHistory();
      setMessages(history || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to use the AI assistant');
      setIsOpen(false);
      return;
    }

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.chat(input);
      const botMessage = { role: 'assistant', content: response.reply || response.message || "I'm here to help you with shopping!", timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 bg-brand-orange text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 group"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ask Nexo
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-brand-orange text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">Ask Nexo - AI Shopping Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Hi! I'm Nexo, your AI shopping assistant.</p>
            <p className="text-sm mt-2">Ask me about products, prices, or get recommendations!</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.timestamp && (
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
              <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about shopping..."
            className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange dark:bg-gray-700 dark:text-white"
            rows="2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-brand-orange text-white p-2 rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;