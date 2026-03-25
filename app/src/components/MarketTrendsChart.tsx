"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";

export function MarketTrendsChart() {
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/dashboard/market-trends`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "id": 1,
            "companyName": ""
          })
        });
        const data = await res.json();
        console.log("data")
        console.log(data)
        setTrendData(data);
      } catch (err) {
        console.error("Trends API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  // Compute Path
  const width = 400;
  const height = 100;
  const paddingY = 20;

  let pathData = "M0,80 L400,80";
  let areaPath = "M0,80 L400,80 L400,100 L0,100 Z";
  let points: any[] = [];
  let maxPoint = { x: 200, y: 40 };
  let lastPoint = { x: 400, y: 20 };
  let peakVolume = "0";

  if (trendData && trendData.series && trendData.series.length > 0) {
    const series = trendData.series;
    const volumes = series.map((d: any) => d.volume);
    const minVol = Math.min(...volumes);
    const maxVol = Math.max(...volumes);
    const range = (maxVol - minVol) || 1;
    peakVolume = maxVol > 1000 ? (maxVol / 1000).toFixed(1) + "k" : maxVol.toString();

    // Mapping x across width, y from (height-padding) down to (padding)
    points = series.map((d: any, i: number) => ({
      x: (i / (series.length - 1)) * width,
      y: height - paddingY - ((d.volume - minVol) / range) * (height - 2 * paddingY),
      isPredictive: d.isPredictive
    }));

    maxPoint = points.reduce((prev, curr) => (curr.y < prev.y ? curr : prev), points[0]);
    lastPoint = points[points.length - 1];

    const generateCatmullRom = (pts: any[]) => {
      if (pts.length === 0) return "";
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i === 0 ? pts[0] : pts[i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i + 2 < pts.length ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    };

    pathData = generateCatmullRom(points);
    areaPath = `${pathData} L ${width},${height} L 0,${height} Z`;
  }

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
          {isLoading ? "ANALYZING..." : trendData ? `${trendData.trendDirection} ${(trendData.percentageChange > 0 ? '+' : '')}${trendData.percentageChange}%` : "NO DATA"}
        </div>
      </div>

      <div className="flex-1 relative mt-2 z-10 w-full h-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-400 gap-3">
            <span className="h-5 w-5 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            Fetching market data...
          </div>
        ) : (
          <>
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
                d={areaPath}
                fill="url(#chartArea)"
                className="animate-in fade-in duration-1000"
              />
              <path
                d={pathData}
                fill="none"
                stroke="url(#chartLine)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
                className="animate-[dash_3s_ease-out_forwards]"
                strokeDasharray="1500"
                strokeDashoffset="1500"
              />

              {/* Point Markers */}
              {trendData && trendData.series && (
                <g className="animate-in fade-in duration-1000 delay-1000 fill-mode-both">
                  {/* Max Peak Marker */}
                  <circle cx={maxPoint.x} cy={maxPoint.y} r="5" fill="#a855f7" />
                  <circle cx={maxPoint.x} cy={maxPoint.y} r="10" fill="none" stroke="#a855f7" strokeWidth="2" className="animate-ping opacity-50" style={{ animationDuration: '3s' }} />

                  {/* Future Projection Marker */}
                  <circle cx={lastPoint.x} cy={lastPoint.y} r="6" fill="#f472b6" />
                  <circle cx={lastPoint.x} cy={lastPoint.y} r="14" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.4" />
                </g>
              )}
            </svg>

            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes dash {
                to { stroke-dashoffset: 0; }
              }
            `}} />

            {/* Tooltips */}
            {trendData && trendData.series && (
              <div
                className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-xl text-center shadow-[0_0_20px_rgba(168,85,247,0.3)] z-10 pointer-events-none"
                style={{
                  left: `${(maxPoint.x / 400) * 100}%`,
                  top: `${(maxPoint.y / 100) * 100}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Peak Volume</p>
                <p className="text-violet-400 font-extrabold text-sm drop-shadow-md">{peakVolume} Units</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10 shrink-0">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-linear-to-b from-indigo-400 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-xs font-semibold text-zinc-300">Historical Actuals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-linear-to-b from-violet-400 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="text-xs font-semibold text-zinc-300">AI Predictive Forecast</span>
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
