"use client";

import { useState } from "react";
import { 
  Send, 
  Sparkles, 
  MessageSquare,
  Bot,
  User,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages] = useState([
    { role: "assistant", content: "Hello! I'm your StratSight assistant. How can we analyze Swiggy & Zomato's recent moves today?" },
    { role: "user", content: "Should we matching Zomato's ₹6 platform fee increase?" },
    { role: "assistant", content: "High sensitivity. Zomato's volume in Bengaluru dropped by 2% post-hike. Swiggy maintaining ₹5 fee could capture 1.5% marginal order share.", isAnalysis: true }
  ]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center hover:scale-110 transition-transform z-50 group border border-zinc-800"
      >
        <MessageSquare className="h-5 w-5" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-linear-to-r from-pink-500 to-rose-500 border-2 border-zinc-950 animate-bounce" />
      </button>
    );
  }

  return (
    <div className="fixed border border-zinc-800 inset-y-0 right-0 w-80 bg-zinc-950/80 backdrop-blur-xl z-40 flex flex-col shadow-2xl transition-all duration-300 transform translate-x-0">
      <div className="h-16 border-b border-zinc-800 px-4 flex items-center justify-between bg-zinc-950/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-100">StratBot AI</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1 px-2 text-zinc-500 hover:text-zinc-100 transition-colors">
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === "user" ? "flex-row-reverse" : ""
          )}>
            <div className={cn(
              "h-8 w-8 rounded-full flex shrink-0 items-center justify-center text-xs border border-zinc-800",
              msg.role === "assistant" ? "bg-zinc-900 text-indigo-400" : "bg-zinc-800 text-zinc-100"
            )}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === "assistant" 
                ? "bg-zinc-900/50 text-zinc-100 border border-zinc-800" 
                : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
            )}>
              {msg.content}
              {msg.isAnalysis && (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  Contextual Insight
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <div className="relative group">
          <textarea 
            rows={1}
            placeholder="Ask AI about strategy..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
          />
          <button className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-zinc-500 text-center uppercase tracking-tighter">
          Analysis powered by GPT-4 & Market Data
        </p>
      </div>
    </div>
  );
}
