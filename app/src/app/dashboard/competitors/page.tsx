"use client";

import { useEffect, useState } from "react";
import { Users, ShieldAlert } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get-competitors`);
        const data = await res.json();
        
        if (data && data.results) {
          const apiComps = data.results.map((item: any) => {
            const score = parseFloat(item.score);
            let impact = "Medium";
            let color = "indigo";
            if (score > 0.6) { impact = "Critical"; color = "rose"; }
            else if (score > 0.3) { impact = "High"; color = "amber"; }

            return {
              id: item.id || Math.random().toString(),
              name: item.name || "Unknown",
              industry: item.industry || "Operations",
              region: item.region || "Global",
              rating: item.rating || "N/A",
              impact: impact,
              color: color,
            };
          });
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
    <div className="space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 relative z-10 w-full max-w-6xl mx-auto h-[85vh] flex flex-col">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative pb-6 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-400" />
            Competitors Intelligence
          </h1>
          <p className="text-zinc-400 text-base">
            Comprehensive tabular data representing all active competitors in your monitored domain and region.
          </p>
        </div>
      </section>

      <div className="flex-1 w-full relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm font-bold flex-col gap-3">
            <span className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            Loading Database...
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest text-xs border-b border-white/10 whitespace-nowrap">Company Name</th>
                  <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest text-xs border-b border-white/10 whitespace-nowrap">Industry Domain</th>
                  <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest text-xs border-b border-white/10 whitespace-nowrap">Region / Location</th>
                  <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest text-xs border-b border-white/10 whitespace-nowrap">Rating</th>
                  <th className="px-6 py-4 font-bold text-zinc-400 uppercase tracking-widest text-xs border-b border-white/10 whitespace-nowrap text-right">Threat Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competitors.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs border backdrop-blur-md shadow-inner transition-colors shrink-0",
                          comp.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          comp.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        )}>
                          {(comp.name || "U").substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate max-w-[200px]" title={comp.name}>
                          {comp.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 font-medium whitespace-nowrap">
                      {comp.industry}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                      {comp.region}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 max-w-[120px] truncate" title={comp.rating}>
                      <span className="bg-white/5 text-zinc-300 px-2.5 py-1 rounded-md border border-white/10 text-xs font-bold inline-block max-w-full truncate">
                        {comp.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center justify-end gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
                        comp.impact === "Critical" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                        comp.impact === "High" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                        "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                      )}>
                        {comp.impact === "Critical" && <ShieldAlert className="h-3 w-3 shrink-0" />}
                        {comp.impact}
                      </span>
                    </td>
                  </tr>
                ))}
                {!isLoading && competitors.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-zinc-700 mb-2" />
                        No competitor data found for the current parameters.
                        <span className="text-xs text-zinc-600 block mt-1">Please try searching with a different Domain or Region on the tracking page.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
