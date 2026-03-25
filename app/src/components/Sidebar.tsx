"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  Settings2,
  Sparkles
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Parameters", href: "/dashboard/tracking", icon: Settings2 },
  { name: "Competitors", href: "/dashboard/competitors", icon: Users },
  { name: "Market Trends", href: "/dashboard/trends", icon: TrendingUp },
  { name: "Signals", href: "/dashboard/signals", icon: Activity },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const [domain, setDomain] = useState("food_delivery");
  const [region, setRegion] = useState("india_national");
  const [scale, setScale] = useState("enterprise");

  useEffect(() => {
    setDomain(localStorage.getItem("stratsight_domain") || "food_delivery");
    setRegion(localStorage.getItem("stratsight_region") || "india_national");
    setScale(localStorage.getItem("stratsight_scale") || "enterprise");
  }, []);

  return (
    <div className="flex flex-col h-full w-64 fixed left-0 top-0 z-40 transition-all duration-300 glass border-r border-white/5 border-t-0 border-b-0 border-l-0">
      <div className="flex h-20 items-center px-6 border-b border-white/5 relative z-10 w-full shrink-0">
        <Link href="/" className="flex items-center gap-3 group relative z-10 w-full">
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500/80 to-violet-600/80 border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <BarChart3 className="h-5 w-5 text-white drop-shadow-md" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
            StratSight
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 relative z-10">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-3 mb-4">
          Main Menu
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-violet-500/5 border border-indigo-500/20 rounded-xl" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-colors relative z-10",
                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] relative z-10 animate-pulse-slow" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto relative z-10">
        <div className="relative p-5 rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl group-hover:border-indigo-500/30 transition-colors duration-500" />
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-violet-400 uppercase tracking-widest drop-shadow-sm">
                Pro Plan active
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Unlock advanced AI insights and deep competitor tracking intelligence.
            </p>
            <button className="w-full py-2.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Upgrade Now
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
