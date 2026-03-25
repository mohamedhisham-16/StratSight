import { OverviewCards } from "@/components/OverviewCards";
import { MarketTrendsChart } from "@/components/MarketTrendsChart";
import { CompetitorCard } from "@/components/CompetitorCard";
import { BrandPerformance } from "@/components/BrandPerformance";
import { SignalFeed } from "@/components/SignalFeed";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">
            Market Intelligence <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-zinc-500 max-w-lg">
            Monitor real-time competitor movements and market signal evolutions across your industry segments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-all">
            Export Data
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2 group">
            Add Competitor
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trends and Competitors */}
        <div className="lg:col-span-2 space-y-8">
          <MarketTrendsChart />
          <CompetitorCard />
        </div>

        {/* Right Column - Brand and Feed */}
        <div className="space-y-8">
          <BrandPerformance />
          <SignalFeed />
        </div>
      </div>

      {/* Footer Info */}
      <footer className="pt-8 border-t border-zinc-900 flex flex-col items-center justify-center gap-2 mt-8">
        <p className="text-xs text-zinc-600 uppercase tracking-widest font-mono font-medium">
          StratSight v1.0.4-beta • All systems operational
        </p>
        <div className="h-1 w-32 bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-linear-to-r from-indigo-500 to-violet-500 rounded-full" />
        </div>
      </footer>
    </div>
  );
}
