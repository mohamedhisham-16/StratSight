"use client";

import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    name: "Brands Tracked",
    value: "18",
    change: "+2",
    trending: "up",
    icon: Users,
    color: "indigo"
  },
  {
    name: "Market Signals",
    value: "245",
    change: "+18%",
    trending: "up",
    icon: Activity,
    color: "violet"
  },
  {
    name: "Delivery Trend",
    value: "Bullish",
    change: "High-Vol",
    trending: "up",
    icon: TrendingUp,
    color: "emerald"
  },
  {
    name: "Risk Index",
    value: "High",
    change: "Volatile",
    trending: "neutral",
    icon: AlertTriangle,
    color: "amber"
  }
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-2 rounded-lg bg-zinc-950 border border-zinc-800 transition-colors group-hover:border-indigo-500/30",
              stat.color === "indigo" && "text-indigo-400",
              stat.color === "violet" && "text-violet-400",
              stat.color === "emerald" && "text-emerald-400",
              stat.color === "amber" && "text-amber-400"
            )}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              stat.trending === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
            )}>
              {stat.trending === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400 mb-1">{stat.name}</p>
            <h3 className="text-2xl font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
              {stat.value}
            </h3>
          </div>
          <div className="absolute -bottom-2 -right-2 h-16 w-16 opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon className="h-full w-full rotate-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
