import { OverviewCards } from "../../components/OverviewCards";
import { MarketTrendsChart } from "../../components/MarketTrendsChart";
import { CompetitorCard } from "../../components/CompetitorCard";
import { BrandPerformance } from "../../components/BrandPerformance";
import { SignalFeed } from "../../components/SignalFeed";
import { ArrowUpRight, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 relative z-10 w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Market Intelligence <br />
              <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-zinc-400 max-w-lg text-lg leading-relaxed">
              Monitor real-time competitor movements and market signal evolutions across your industry segments.
            </p>
          </div>
        </div>

      </section>

      {/* Overview Cards */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both @container">
        <OverviewCards />
      </div>

      {/* Stacked Layout */}
      <div className="flex flex-col gap-8 w-full mt-8">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both w-full">
          <MarketTrendsChart />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 fill-mode-both w-full">
          <CompetitorCard />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both w-full h-[450px]">
          <BrandPerformance />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600 fill-mode-both w-full h-[500px]">
          <SignalFeed />
        </div>
      </div>

      {/* Footer Info */}
      <footer className="pt-12 pb-6 flex flex-col items-center justify-center gap-4 mt-12 opacity-80">
        <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-mono font-medium drop-shadow-sm">
          StratSight v1.0.4-beta • <span className="text-emerald-400">All systems operational</span>
        </p>
        <div className="h-[2px] w-48 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>
      </footer>
    </div>
  );
}
