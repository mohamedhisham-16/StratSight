"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Bell, 
  Tag, 
  TrendingUp, 
  ShieldAlert,
  ChevronRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

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

export default function InsightsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get-signals?limit=all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSignals(data);
        }
      })
      .catch(err => console.error("Error fetching signals:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSignals = signals.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.company && s.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.metadata && s.metadata.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2.5 rounded-xl glass-panel text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Market Intelligence</h1>
            <p className="text-zinc-400 font-medium">Core Signal Feed & AI Insights</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within/search:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search signals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/10 transition-all w-64"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl glass-panel text-sm font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Signal</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Brand</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Impact</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Context</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <span className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Aggregating Global Intelligence...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSignals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 font-bold uppercase tracking-widest">
                    No signals matching your criteria
                  </td>
                </tr>
              ) : (
                filteredSignals.map((signal, idx) => {
                  const Icon = getIconForType(signal.type);
                  const color = getColorForImportance(signal.importance);
                  
                  return (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="px-6 py-6 max-w-md">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 transition-all group-hover:scale-110",
                            color === "rose" ? "text-rose-400 border-rose-500/20 bg-rose-500/5" :
                            color === "indigo" ? "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" :
                            color === "emerald" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                            "text-zinc-400 border-zinc-500/20 bg-zinc-500/5"
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-6">
                              {signal.title}
                            </p>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 block">
                              {signal.type || 'General'} Market Signal
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                          {signal.company || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          signal.importance === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          signal.importance === "Medium" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        )}>
                          {signal.importance}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-xs font-semibold text-zinc-400 italic">
                          {signal.metadata || 'Analyzing implications...'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimeAgo(signal.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
