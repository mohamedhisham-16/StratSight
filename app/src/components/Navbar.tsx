"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Command } from "lucide-react";

export function Navbar() {
  const [userName, setUserName] = useState<string>("Haswanth Tamil");
  const [initials, setInitials] = useState<string>("HT");

  useEffect(() => {
    const savedName = localStorage.getItem("stratsight_company_name");
    if (savedName) {
      setUserName(savedName);
      setInitials(savedName.substring(0, 2).toUpperCase());
    }
  }, []);

  return (
    <header className="h-20 border-b border-white/5 bg-transparent backdrop-blur-3xl sticky top-0 z-30 px-8 flex items-center justify-between transition-all duration-500">
      <div className="flex items-center gap-4 w-1/3">
        <div className="flex items-center gap-2 mr-4">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white hidden sm:block">
            Strat<span className="text-indigo-400">Sight</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <button title="Notifications" aria-label="Notifications" className="relative p-2.5 rounded-full text-zinc-400 hover:text-white glass-panel border-transparent hover:border-white/10 transition-all group">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-[#0a0a0a] group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/10 mx-1" />

        <button className="flex items-center gap-3 p-1.5 pr-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/40 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-9 w-9 rounded-full bg-linear-to-br from-indigo-500/40 to-violet-500/40 border border-white/20 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all shadow-lg backdrop-blur-md">
              {initials}
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-zinc-100 leading-tight group-hover:text-white transition-colors">{userName}</p>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider leading-none">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-1" />
        </button>
      </div>
    </header>
  );
}
