import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from "../components/AppLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StratSight | Competitor Intelligence Platform",
  description: "Modern SaaS dashboard for market intelligence and strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030303] text-zinc-100 min-h-screen flex selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden`}
      >
        {/* Animated Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-blob mix-blend-screen" />
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-violet-600/10 blur-[120px] rounded-full animate-blob-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-fuchsia-600/5 blur-[150px] rounded-full animate-blob mix-blend-screen" style={{ animationDelay: '4s' }} />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
