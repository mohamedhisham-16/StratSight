"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Competitors", href: "/competitors", icon: Users },
  { name: "Market Trends", href: "/trends", icon: TrendingUp },
  { name: "Signals", href: "/signals", icon: Activity },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-64 fixed left-0 top-0 z-40 transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            Strat<span className="text-indigo-400">Sight</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-zinc-900 text-indigo-400 shadow-sm border border-zinc-800/50" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-linear-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 group hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Pro Plan</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Unlock advanced AI insights and competitor tracking.
          </p>
          <button className="w-full py-2 text-xs font-semibold bg-zinc-100 text-zinc-950 rounded-lg hover:bg-white transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
