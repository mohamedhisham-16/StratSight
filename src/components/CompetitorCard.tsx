"use client";

import { 
  ArrowUpRight, 
  ExternalLink,
  Zap,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

const competitors = [
  {
    name: "Zomato",
    impact: "High",
    change: "Zomato Gold Revamp",
    trend: "up",
    logo: "Z",
    lastUpdate: "12m ago"
  },
  {
    name: "Swiggy",
    impact: "High",
    change: "Dineout Integration",
    trend: "up",
    logo: "S",
    lastUpdate: "1h ago"
  },
  {
    name: "Zepto",
    impact: "Medium",
    change: "Zepto Pass Launch",
    trend: "up",
    logo: "Zp",
    lastUpdate: "4h ago"
  }
];

export function CompetitorCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">Top Competitors</h3>
        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
          View All <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {competitors.map((comp, i) => (
          <div 
            key={i} 
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 group-hover:border-indigo-500/30 transition-colors">
                {comp.logo}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100 mb-0.5">{comp.name}</h4>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    comp.impact === "High" ? "bg-rose-500/10 text-rose-500" :
                    comp.impact === "Medium" ? "bg-amber-500/10 text-amber-500" :
                    "bg-zinc-500/10 text-zinc-400"
                  )}>
                    {comp.impact} Impact
                  </span>
                  <span className="text-[10px] text-zinc-500">{comp.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div className="hidden sm:block">
                <p className="text-xs text-zinc-400 mb-1 leading-none uppercase tracking-tighter">Key Change</p>
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                  {comp.change.includes("Price") ? <Tag className="h-3 w-3 text-amber-400" /> : <Zap className="h-3 w-3 text-indigo-400" />}
                  {comp.change}
                </div>
              </div>
              <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
