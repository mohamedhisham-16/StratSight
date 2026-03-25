"use client";

import { useState, useEffect, useRef } from 'react';

const CHART_COLORS = ['#f97316', '#f43f5e', '#eab308', '#a1a1aa', '#3b82f6', '#8b5cf6'];

export function BrandPerformance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState([
    { name: 'Loading...', value: 100, color: '#a1a1aa' }
  ]);

  // Canvas drawing effect, robustly responding to window resize and CSS flex adjustments
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animationFrameId: number;
    let currentAnimateProgress = 0.0;

    const drawChart = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const { width, height } = container.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (!ctx || width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) * 0.90;
      const innerRadius = radius * 0.75;

      const total = data.reduce((acc, item) => acc + (item.value || 0), 0) || 1;
      let startAngle = -Math.PI / 2;
      const gap = 0.08;

      const progress = Math.min(1, currentAnimateProgress);

      data.forEach((item) => {
        const itemVal = item.value || 0;
        // Don't draw slices with minimal representation in view
        if (itemVal <= 0) return;

        const sliceAngle = (itemVal / total) * 2 * Math.PI * progress;

        // Safety guard against negative angle sweeps if gap is too big for the slice
        if (sliceAngle <= gap) {
          startAngle += sliceAngle;
          return;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle + gap / 2, startAngle + sliceAngle - gap / 2);
        ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle - gap / 2, startAngle + gap / 2, true);
        ctx.closePath();

        // Add drop shadow simulating filter: drop-shadow and outer glows
        ctx.shadowColor = item.color;
        ctx.shadowBlur = Math.min(15, cx * 0.1);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = item.color;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
        startAngle += sliceAngle;
      });

      // Animate opening rotation
      if (currentAnimateProgress < 1) {
        currentAnimateProgress += 0.05;
        animationFrameId = requestAnimationFrame(drawChart);
      }
    };

    // Trigger entrance animation
    animationFrameId = requestAnimationFrame(drawChart);

    // Using ResizeObserver effectively bypasses all width(-1) error states
    const observer = new ResizeObserver(() => {
      // Once animation finishes, ResizeObserver seamlessly handles normal flexbox repaints
      if (currentAnimateProgress >= 1) requestAnimationFrame(drawChart);
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [data]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/metrics/market-share`)
      .then(res => res.json())
      .then(resData => {
        if (Array.isArray(resData) && resData.length > 0) {
          const mappedData = resData.map((item, index) => ({
            name: item.brand,
            value: item.sharePercentage,
            color: CHART_COLORS[index % CHART_COLORS.length]
          }));
          setData(mappedData);
        }
      })
      .catch(err => console.error("Error fetching market share:", err));
  }, []);
  return (
    <div className="glass-panel p-8 rounded-3xl h-full flex flex-col group relative overflow-hidden isolate">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Brand Share
          </h3>
          <p className="text-sm text-zinc-400 font-medium">Market Performance</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-[220px] relative z-10 flex items-center justify-center p-4"
      >
        {/* Glow behind chart */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full animate-blob mix-blend-screen" />
          <div className="w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full animate-blob-slow mix-blend-screen" />
        </div>

        {/* Swapped SVG PieChart with a pure scalable Canvas node */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-lg">
          <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-400 leading-none">
            {data[0]?.name !== 'Loading...' ? `${Math.round(data[0]?.value || 0)}%` : '--'}
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest mt-1">
            {data[0]?.name !== 'Loading...' ? data[0]?.name : 'Loading...'}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 pt-4 border-t border-white/5 relative z-10">
        {data.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group/item">
            <div
              className="h-3.5 w-3.5 rounded-full ring-2 ring-offset-2 ring-offset-[#0a0a0a] shadow-[0_0_10px_currentColor] transition-all"
              style={{ backgroundColor: item.color, color: item.color, borderColor: item.color }}
            />
            <span className="text-xs font-bold text-zinc-300 truncate group-hover/item:text-white transition-colors">{item.name}</span>
            <span className="ml-auto text-xs font-black text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
