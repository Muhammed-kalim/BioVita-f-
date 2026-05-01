import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Loader2, Info, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { startHealthChat } from "../services/geminiService";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "Hello! I'm BioVita AI, your health assistant. How can I help you today? \n\n*Disclaimer: I am an AI, not a doctor. This information is for educational purposes only and should not replace professional medical advice.*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chat = startHealthChat(messages.map(m => ({
        role: m.role,
        content: m.text
      })));

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "I encountered an error while processing your request. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "model",
        text: "Hello! I'm BioVita AI, your health assistant. How can I help you today? \n\n*Disclaimer: I am an AI, not a doctor. This information is for educational purposes only and should not replace professional medical advice.*",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-zinc-800/50 backdrop-blur-md p-4 text-white flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-full border border-blue-500/30">
            <Bot size={24} className="text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">BioVita AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Online & Ready</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
          title="Clear Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
                  : "bg-zinc-800/80 text-zinc-100 border border-white/5 rounded-tl-none"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] uppercase font-bold tracking-[0.1em]">
                {message.role === "user" ? (
                  <>
                    <span>Patient</span>
                    <User size={10} />
                  </>
                ) : (
                  <>
                    <Bot size={10} />
                    <span>BioVita AI</span>
                  </>
                )}
              </div>
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-white prose-strong:text-blue-300">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              <div className="mt-3 text-[9px] opacity-30 text-right font-mono">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/50 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <div className="flex gap-1">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              </div>
              <span className="text-xs text-zinc-500 font-medium italic">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-900/20 border-y border-amber-900/30 p-2.5 px-5 flex items-start gap-3">
        <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-200/70 leading-tight">
          <span className="font-bold text-amber-500 uppercase tracking-wider mr-1">Medical Disclaimer:</span>
          BioVita AI provides general information and is not a substitute for professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>

      {/* Input */}
      <div className="p-5 bg-zinc-900 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask a health question..."
              className="w-full p-3.5 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-white placeholder:text-zinc-500 transition-all"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};


export default ChatInterface;
