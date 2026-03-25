"use client";

import { Search, Bell, User, ChevronDown, Command } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative group w-full max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none group-focus-within:text-indigo-400 text-zinc-500 transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-10 pr-12 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            placeholder="Search signals, competitors..."
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[10px] font-mono text-zinc-400">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all relative group">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 border-2 border-zinc-950 group-hover:scale-110 transition-transform" />
        </button>

        <div className="h-8 w-[1px] bg-zinc-800 mx-2" />

        <button className="flex items-center gap-3 p-1 rounded-full text-zinc-400 hover:text-zinc-100 transition-all group">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500/20 to-violet-500/20 border border-zinc-800 flex items-center justify-center text-indigo-400 font-bold text-xs ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
            HT
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-zinc-100 leading-none mb-1">Haswanth Tamil</p>
            <p className="text-xs text-zinc-500 leading-none">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </button>
      </div>
    </header>
  );
}
