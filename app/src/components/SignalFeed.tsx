"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Tag,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils";

const getIconForType = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('pricing') || t.includes('partnership')) return Tag;
  if (t.includes('expansion') || t.includes('funding')) return TrendingUp;
  if (t.includes('legal')) return ShieldAlert;
  return Bell;
};

const getColorForImportance = (importance: string) => {
  const imp = (importance || '').toLowerCase();
  if (imp === 'high') return 'rose';
  if (imp === 'medium') return 'indigo';
  if (imp === 'low') return 'zinc';
  return 'emerald';
};

const formatTimeAgo = (timestamp: string) => {
  if (!timestamp) return 'Recently';
  try {
    const diff = Date.now() - new Date(timestamp).getTime();
    if (isNaN(diff) || diff < 0) return timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(1, mins)} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch (e) {
    return timestamp;
  }
};

export function SignalFeed() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("stratsight_signals_cache");
    if (cached) {
      try { setSignals(JSON.parse(cached)); } catch(e){}
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get-signals`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSignals(data);
          localStorage.setItem("stratsight_signals_cache", JSON.stringify(data));
        }
      })
      .catch(err => console.error("Error fetching signals:", err));
  }, []);

  return (
    <div className="glass-panel p-8 rounded-3xl flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 blur-[80px] rounded-full -z-10" />

      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-10">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Signals Feed
        </h3>
        <button className="relative p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-md group/bell">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-[#0a0a0a] group-hover/bell:scale-110 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10 pb-4">
        {/* Continuous Timeline Track */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-linear-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

        <div className="space-y-6">
          {signals.length === 0 ? (
            <div className="text-zinc-400 text-sm text-center py-8 drop-shadow-md">Loading signals or no data available...</div>
          ) : signals.map((rawSignal, i) => {
            const signal = {
              title: rawSignal.title,
              timestamp: formatTimeAgo(rawSignal.timestamp),
              importance: rawSignal.importance || 'Medium',
              icon: getIconForType(rawSignal.type),
              color: getColorForImportance(rawSignal.importance),
              company: rawSignal.company,
              metadata: rawSignal.metadata
            };
            return (
              <div
                key={i}
                className="group/item flex gap-5 relative group"
              >
                {/* Timeline Dot/Icon */}
                <div className="relative z-10 mt-1 shrink-0">
                  <div className={cn(
                    "absolute inset-0 rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity",
                    signal.color === "rose" ? "bg-rose-500/50" :
                      signal.color === "indigo" ? "bg-indigo-500/50" :
                        signal.color === "emerald" ? "bg-emerald-500/50" : "bg-zinc-500/50"
                  )} />
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center border shadow-lg relative bg-[#0a0a0a] transition-all",
                    signal.color === "rose" ? "text-rose-400 border-rose-500/20 group-hover/item:border-rose-500/50" :
                      signal.color === "indigo" ? "text-indigo-400 border-indigo-500/20 group-hover/item:border-indigo-500/50" :
                        signal.color === "emerald" ? "text-emerald-400 border-emerald-500/20 group-hover/item:border-emerald-500/50" :
                          "text-zinc-400 border-zinc-500/20 group-hover/item:border-zinc-500/50"
                  )}>
                    <signal.icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group-hover/item:translate-x-1 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border flex items-center shadow-inner",
                      signal.importance === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                        signal.importance === "Medium" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    )}>
                      {signal.importance}
                    </span>
                    {signal.company && (
                      <span className="ml-3 text-[10px] font-bold text-indigo-300 mr-2 bg-white/5 px-2 py-0.5 rounded border border-white/5 max-w-[80px] truncate" title={signal.company}>
                        {signal.company}
                      </span>
                    )}
                    {signal.metadata && (
                      <span className="text-[10px] font-medium text-zinc-400 italic mr-auto truncate max-w-[120px] hidden sm:block">
                        {signal.metadata}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      {signal.timestamp}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-200 group-hover/item:text-white transition-colors leading-relaxed">
                    {signal.title}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="mt-6 w-full py-3.5 text-xs font-bold text-white uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
        <span className="relative z-10 flex items-center gap-2">
          View Full History
          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </span>
      </button>
    </div>
  );
}
