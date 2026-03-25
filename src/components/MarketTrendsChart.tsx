"use client";

import { TrendingUp, ArrowRight } from "lucide-react";

export function MarketTrendsChart() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 h-[300px] flex flex-col group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
            Market Trend Signals
          </h3>
          <p className="text-sm text-zinc-500">Last 30 Days</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-medium text-indigo-400 group-hover:border-indigo-500/20 transition-all">
          <TrendingUp className="h-4 w-4" />
          Bullish +12.5%
        </div>
      </div>

      <div className="flex-1 relative mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          
          <path 
            d="M0,80 Q50,70 100,85 T200,40 T300,60 T400,20 L400,100 L0,100 Z" 
            fill="url(#chartGradient)"
            className="animate-in fade-in duration-1000"
          />
          <path 
            d="M0,80 Q50,70 100,85 T200,40 T300,60 T400,20" 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="animate-in fade-in slide-in-from-left-4 duration-700"
          />
          
          <circle cx="200" cy="40" r="4" fill="#6366f1" stroke="#09090b" strokeWidth="2" />
          <circle cx="400" cy="20" r="4" fill="#a855f7" stroke="#09090b" strokeWidth="2" />
        </svg>
        
        <div className="absolute top-0 left-[200px] -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-[10px] shadow-xl z-10">
          <p className="text-zinc-400">Peak Signal</p>
          <p className="text-indigo-400 font-bold">158 Units</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800/50">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-xs text-zinc-500">AI Trends</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-xs text-zinc-500">Price Drops</span>
          </div>
        </div>
        <button className="text-xs font-semibold text-zinc-400 hover:text-zinc-100 flex items-center gap-1 group/btn">
          View Detailed Reports
          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
