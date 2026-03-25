"use client";

import { TrendingUp, ArrowRight } from "lucide-react";

export function MarketTrendsChart() {
  return (
    <div className="glass-panel p-8 rounded-3xl h-[380px] flex flex-col group relative overflow-hidden isolate">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 blur-[100px] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm flex items-center gap-2">
            Market Trend Signals
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </h3>
          <p className="text-sm text-zinc-400 font-medium">Volume & Price Action (30 Days)</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-extrabold text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-shadow backdrop-blur-md">
          <TrendingUp className="h-4 w-4" />
          BULLISH +12.5%
        </div>
      </div>

      <div className="flex-1 relative mt-2 z-10">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
          <div className="border-b border-white w-full" />
        </div>
        
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <path 
            d="M0,80 Q50,70 100,85 T200,40 T300,65 T400,20 L400,100 L0,100 Z" 
            fill="url(#chartArea)"
            className="animate-in fade-in duration-1000"
          />
          <path 
            d="M0,80 Q50,70 100,85 T200,40 T300,65 T400,20" 
            fill="none" 
            stroke="url(#chartLine)" 
            strokeWidth="4" 
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-[dash_3s_ease-out_forwards]"
            strokeDasharray="1000"
            strokeDashoffset="1000"
          />
          
          {/* Data Points */}
          <g className="animate-in fade-in duration-1000 delay-1000 fill-mode-both">
            <circle cx="200" cy="40" r="5" fill="#a855f7" />
            <circle cx="200" cy="40" r="10" fill="none" stroke="#a855f7" strokeWidth="2" className="animate-ping opacity-50" style={{ animationDuration: '3s' }} />
            
            <circle cx="400" cy="20" r="6" fill="#f472b6" />
            <circle cx="400" cy="20" r="14" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.4" />
          </g>
        </svg>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}} />
        
        {/* Tooltips */}
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-xl text-center shadow-[0_0_20px_rgba(168,85,247,0.3)] z-10 pointer-events-none">
          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Peak Volume</p>
          <p className="text-violet-400 font-extrabold text-sm drop-shadow-md">24.5k Units</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-linear-to-b from-indigo-400 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-xs font-semibold text-zinc-300">Predictive AI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-linear-to-b from-violet-400 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="text-xs font-semibold text-zinc-300">Actuals</span>
          </div>
        </div>
        <button className="text-xs font-extrabold px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 group/btn border border-white/5 transition-all">
          Generate Deep Report
          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
