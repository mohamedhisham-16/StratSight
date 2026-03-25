"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ChatPanel } from "./ChatPanel";
import { cn } from "../lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Onboarding screen has no layout
  if (pathname === "/") {
    return <main className="h-screen w-full bg-[#030303] overflow-y-auto p-4 sm:p-8">{children}</main>;
  }

  return (
    <div className="relative z-10 flex w-full h-screen">
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col ml-64 transition-all duration-300 relative h-screen",
          isChatOpen ? "mr-[380px]" : "mr-0"
        )}
      >
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
      <ChatPanel isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}
