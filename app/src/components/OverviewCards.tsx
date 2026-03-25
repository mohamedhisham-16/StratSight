"use client";

import { useState, useEffect } from "react";

import {
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "../lib/utils";

const stats = [
  {
    name: "Competitors Tracked",
    value: "14",
    change: "+2 this week",
    trending: "up",
    icon: Users,
    color: "indigo"
  },
  {
    name: "Active Signals",
    value: "128",
    change: "+15 today",
    trending: "up",
    icon: Activity,
    color: "violet"
  },
  {
    name: "Market Trend",
    value: "Bullish",
    change: "High-Volume",
    trending: "up",
    icon: TrendingUp,
    color: "emerald"
  },
  {
    name: "Risk Level",
    value: "Medium",
    change: "Stable",
    trending: "neutral",
    icon: AlertTriangle,
    color: "amber"
  }
];

export function OverviewCards() {
  const [competitorCount, setCompetitorCount] = useState("14");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get-competitors`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number' && data.count > 0) {
          setCompetitorCount(data.count.toString());
        }
      })
      .catch(err => console.error("API error", err));

    // Start background signal processing on dashboard load
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/process-signals-background`, {
      method: 'POST'
    }).catch(err => console.error("Background processing init error", err));
  }, []);

  const dynamicStats = [...stats];
  dynamicStats[0].value = competitorCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 @[900px]:grid-cols-4 gap-6">
      {dynamicStats.map((stat, i) => (
        <div
          key={i}
          className="glass-panel p-6 rounded-2xl group relative overflow-hidden isolate"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Animated Glow Backdrop */}
          <div className={cn(
            "absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl -z-10",
            stat.color === "indigo" ? "bg-indigo-500" :
              stat.color === "violet" ? "bg-violet-500" :
                stat.color === "emerald" ? "bg-emerald-500" :
                  "bg-amber-500"
          )} />

          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={cn(
              "p-3 rounded-xl bg-white/[0.03] border border-white/10 transition-all duration-500 group-hover:scale-110",
              stat.color === "indigo" ? "text-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:border-indigo-500/50" :
                stat.color === "violet" ? "text-violet-400 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:border-violet-500/50" :
                  stat.color === "emerald" ? "text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:border-emerald-500/50" :
                    "text-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:border-amber-500/50"
            )}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md border",
              stat.trending === "up"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            )}>
              {stat.trending === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {stat.change}
            </div>
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <h3 className="text-4xl font-extrabold text-white tracking-tighter drop-shadow-md">
              {stat.value}
            </h3>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{stat.name}</p>
          </div>

          {/* Decorative Corner Icon */}
          <div className="absolute -bottom-6 -right-6 h-32 w-32 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
            <stat.icon className="h-full w-full rotate-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
