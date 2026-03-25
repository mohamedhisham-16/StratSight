"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  Minus
} from "lucide-react";
import { cn } from "../lib/utils";

export function ChatPanel({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I'm your StratSight assistant. How can I help you analyze the market today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that.",
        isAnalysis: data.hasContext
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50 flex items-center justify-center group animate-in zoom-in duration-300">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-slow" />
        <button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center hover:scale-105 transition-transform border border-white/20"
        >
          <MessageSquare className="h-6 w-6" />
          <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-linear-to-r from-pink-500 to-rose-500 border-2 border-[#0a0a0a] animate-bounce shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-4 right-4 w-[360px] glass bg-black/60 backdrop-blur-3xl z-40 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] border-white/10 rounded-3xl transition-all duration-500 transform translate-x-0 overflow-hidden isolate animate-in slide-in-from-right-8 duration-500">
      {/* Background Orbs */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 blur-[50px] rounded-full -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/2 -left-20 w-32 h-32 bg-violet-600/20 blur-[50px] rounded-full -z-10 mix-blend-screen" />

      <div className="h-20 border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.02] relative z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-40 rounded-xl animate-pulse-slow" />
            <div className="relative h-10 w-10 rounded-xl bg-linear-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="h-5 w-5 text-indigo-300" />
            </div>
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight leading-tight block">StratBot AI</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all">
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
            msg.role === "user" ? "flex-row-reverse" : ""
          )} style={{ animationDelay: `${i * 150}ms` }}>
            <div className={cn(
              "h-9 w-9 xl:w-10 xl:h-10 rounded-full flex shrink-0 items-center justify-center text-xs shadow-lg border",
              msg.role === "assistant"
                ? "bg-white/5 border-white/10 text-indigo-400 shadow-indigo-500/10"
                : "bg-indigo-500 border-indigo-400 text-white shadow-indigo-500/30"
            )}>
              {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md max-w-[85%]",
              msg.role === "assistant"
                ? "bg-white/[0.04] text-zinc-200 border border-white/10 rounded-tl-sm relative"
                : "bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20 border border-indigo-400/30 rounded-tr-sm"
            )}>
              {msg.role === "assistant" && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[20px] rounded-full pointer-events-none -z-10" />
              )}
              {typeof msg.content === 'string' ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-extrabold text-white" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-zinc-300" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-base font-black text-white mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-sm font-bold text-white mb-1.5" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xs font-bold text-white mb-1" {...props} />,
                    code: ({node, ...props}) => <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-black/40 p-3 rounded-xl overflow-x-auto border border-white/10 mb-2 mt-2 custom-scrollbar text-[11px]" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-indigo-500/50 pl-3 italic text-zinc-400 mb-2" {...props} />,
                    a: ({node, ...props}) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/30" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : msg.content}
              {msg.isAnalysis && (
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5 bg-white/5 p-2 rounded-lg inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  Contextual Insight
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-white/10 bg-white/[0.02] relative z-10 backdrop-blur-md">
        <div className="relative group">
          <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-indigo-500/50 group-focus-within:bg-white/10 transition-all duration-300" />
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isTyping ? "AI is thinking..." : "Ask AI about strategy..."}
            disabled={isTyping}
            className="w-full relative z-10 bg-transparent py-4 pl-5 pr-14 text-sm text-white placeholder-zinc-500 focus:outline-hidden resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-2 z-20 h-10 w-10 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.3)] active:scale-95 border border-white/20 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-zinc-500 text-center font-bold uppercase tracking-widest drop-shadow-sm flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          Powered by Gemini AI & Core Data
        </p>
      </div>
    </div>
  );
}