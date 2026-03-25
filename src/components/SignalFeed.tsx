"use client";

import { 
  Bell, 
  Tag, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const signals = [
  {
    title: "Zomato hikes platform fee to ₹6 in select cities",
    timestamp: "12 min ago",
    importance: "High",
    icon: Tag,
    color: "rose"
  },
  {
    title: "Swiggy tests 'Pocket' ultra-cheap delivery service",
    timestamp: "45 min ago",
    importance: "Medium",
    icon: TrendingUp,
    color: "indigo"
  },
  {
    title: "10-minute grocery delivery growing in Tier-2 markets",
    timestamp: "2h ago",
    importance: "High",
    icon: ShieldAlert,
    color: "emerald"
  },
  {
    title: "Cloud kitchen expansion slowing down in Q3",
    timestamp: "5h ago",
    importance: "Low",
    icon: Bell,
    color: "zinc"
  }
];

export function SignalFeed() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col h-full group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
          Signals & Insights Feed
        </h3>
        <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {signals.map((signal, i) => (
          <div 
            key={i} 
            className="group/item flex gap-4 p-3 rounded-xl hover:bg-zinc-950 hover:border-zinc-800 border border-transparent transition-all duration-300"
          >
            <div className={cn(
              "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border border-zinc-800/50",
              signal.color === "rose" ? "text-rose-400 bg-rose-500/5" :
              signal.color === "indigo" ? "text-indigo-400 bg-indigo-500/5" :
              signal.color === "emerald" ? "text-emerald-400 bg-emerald-500/5" :
              "text-zinc-400 bg-zinc-500/5"
            )}>
              <signal.icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                  signal.importance === "High" ? "bg-rose-500/10 text-rose-500" :
                  signal.importance === "Medium" ? "bg-indigo-500/10 text-indigo-400" :
                  "bg-zinc-500/10 text-zinc-400"
                )}>
                  {signal.importance}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-tighter">
                  <Clock className="h-3 w-3" />
                  {signal.timestamp}
                </div>
              </div>
              <h4 className="text-sm font-medium text-zinc-200 group-hover/item:text-white transition-colors">
                {signal.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-lg hover:bg-zinc-950 transition-all flex items-center justify-center gap-2 group/btn">
        View Full History
        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
