"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  ExternalLink,
  Zap,
  Tag,
  ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils";

const mockCompetitors = [
  {
    name: "Zomato",
    impact: "High",
    change: "Zomato Gold Revamp",
    trend: "up",
    logo: "Z",
    color: "rose",
    lastUpdate: "12m ago"
  },
  {
    name: "Swiggy",
    impact: "Critical",
    change: "Dineout Integration",
    trend: "up",
    logo: "S",
    color: "amber",
    lastUpdate: "1h ago"
  },
  {
    name: "sidvbd",
    impact: "Medium",
    change: "Zepto Pass Launch",
    trend: "up",
    logo: "Zp",
    color: "indigo",
    lastUpdate: "4h ago"
  }
];

export function CompetitorCard({ hideRadarButton = false }: { hideRadarButton?: boolean }) {
  const router = useRouter();
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        console.log("use effect", process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get-competitors`);
        const data = await res.json();
        console.log(data)

        if (data && data.results && data.results.length > 0) {
          const apiComps = data.results.slice(0, 5).map((item: any) => {
            const score = parseFloat(item.score);
            let impact = "Medium";
            let color = "indigo";
            if (score > 0.6) { impact = "Critical"; color = "rose"; }
            else if (score > 0.3) { impact = "High"; color = "amber"; }

            return {
              name: item.name || "Unknown",
              impact: impact,
              change: (item.industry || "Operations").substring(0, 30),
              trend: "up",
              logo: (item.name || "U").substring(0, 2).toUpperCase(),
              color: color,
              lastUpdate: "Just now"
            };
          });
          console.log(apiComps);
          setCompetitors(apiComps);
        }
      } catch (err) {
        console.error("API Error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitors();
  }, []);

  return (
    <div className="glass-panel p-8 rounded-3xl space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Competitor Radar
          </h3>
          <p className="text-sm text-zinc-400 font-medium">Real-time threat assessment</p>
        </div>
        {!hideRadarButton && (
          <button onClick={() => router.push("/dashboard/competitors")} className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 transition-all shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Radar View <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm font-bold flex-col gap-3">
            <span className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            Loading Intelligence...
          </div>
        ) : competitors.map((comp, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
          >
            {/* Impact Gradient Overlay */}
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity -z-10",
              comp.color === 'rose' ? 'bg-rose-500' :
                comp.color === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'
            )} />

            <div className="flex items-center gap-4 relative z-10">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black border backdrop-blur-md shadow-inner transition-colors",
                comp.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[inset_0_0_10px_rgba(244,63,94,0.1)] group-hover:border-rose-500/40' :
                  comp.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)] group-hover:border-amber-500/40' :
                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)] group-hover:border-indigo-500/40'
              )}>
                {comp.logo}
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  {comp.name}
                  <span className="text-[10px] text-zinc-500 font-medium">{comp.lastUpdate}</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest flex items-center gap-1",
                    comp.impact === "Critical" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      comp.impact === "High" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  )}>
                    {comp.impact === "Critical" && <ShieldAlert className="h-2.5 w-2.5" />}
                    {comp.impact} Impact
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:text-right relative z-10 ml-16 sm:ml-0">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Action Detected</p>
                <div className="flex justify-end items-center gap-1.5 text-xs font-bold text-zinc-200 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                  {comp.change.includes("Revamp") ? <Tag className="h-3.5 w-3.5 text-amber-400" /> : <Zap className="h-3.5 w-3.5 text-indigo-400" />}
                  {comp.change}
                </div>
              </div>
              <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-sm">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
