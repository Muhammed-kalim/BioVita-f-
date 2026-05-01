import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { startHealthChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const GlobalAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{
        role: 'model',
        content: "Hello! I'm BioVita AI. How can I help you with your health today?"
      }]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let activeChat = chat;
      if (!activeChat) {
        activeChat = startHealthChat([]);
        setChat(activeChat);
      }

      const result = await activeChat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "Sorry, I'm having trouble connecting. Please ensure your Gemini API key is set in .env." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[380px] max-w-[90vw] h-[550px] max-h-[70vh] glass rounded-[2rem] border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-red-600/10 to-blue-600/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">BioVita Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">AI Ready</span>
                  </div>
                </div>
              </div>
              <button onClick={handleToggle} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-4 h-4 text-white/40 hover:text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-black/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    <div className="prose prose-invert prose-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="How can I help you?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-red-500/30 transition-all text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[8px] text-white/20 text-center mt-3 uppercase tracking-widest font-bold">
                BioVita AI • Medical Disclaimer Applies
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-white text-black' : 'bg-red-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default GlobalAIAssistant;
