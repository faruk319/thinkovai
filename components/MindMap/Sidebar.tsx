"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mapContext: string;
}

export default function Sidebar({ isOpen, onClose, mapContext }: SidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
          mapContext,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-[380px] h-full bg-white/95 backdrop-blur-xl border-l border-zinc-200 flex flex-col shadow-2xl z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-zinc-900 font-bold tracking-tight text-sm">AI Assistant</h3>
            <p className="text-zinc-500 text-xs font-medium">Chat about your mind map</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center">
              <Bot size={32} className="text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-600">
              Ask me anything about your mind map!
            </p>
            <div className="space-y-2 mt-6 max-w-[80%] mx-auto">
              <button
                onClick={() => setInput("Expand the main topic further")}
                className="block w-full text-xs px-3 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors font-medium shadow-sm"
              >
                "Expand the main topic further"
              </button>
              <button
                onClick={() => setInput("Suggest more subtopics")}
                className="block w-full text-xs px-3 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors font-medium shadow-sm"
              >
                "Suggest more subtopics"
              </button>
              <button
                onClick={() => setInput("Explain the connections")}
                className="block w-full text-xs px-3 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors font-medium shadow-sm"
              >
                "Explain the connections"
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mt-0.5">
                <Bot size={16} className="text-zinc-700" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed font-medium shadow-sm ${
                msg.role === "user"
                  ? "bg-zinc-900 text-white rounded-2xl rounded-tr-sm"
                  : "bg-white border border-zinc-200 text-zinc-800 rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mt-0.5">
                <User size={16} className="text-zinc-700" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mt-0.5">
              <Bot size={16} className="text-zinc-700" />
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-200 bg-white">
        <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 focus-within:border-zinc-300 focus-within:bg-white transition-all shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your map..."
            rows={1}
            className="flex-1 bg-transparent text-zinc-900 text-sm outline-none resize-none placeholder:text-zinc-400 py-1.5 font-medium max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 mb-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
