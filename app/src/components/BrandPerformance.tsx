"use client";

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CHART_COLORS = ['#f97316', '#f43f5e', '#eab308', '#a1a1aa', '#3b82f6', '#8b5cf6'];

export function BrandPerformance() {
  const [data, setData] = useState([
    { name: 'Loading...', value: 100, color: '#a1a1aa' }
  ]);

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

      <div className="flex-1 min-h-[220px] relative z-10 flex items-center justify-center">
        {/* Glow behind chart */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full animate-blob mix-blend-screen" />
          <div className="w-32 h-32 bg-rose-500/10 blur-[50px] rounded-full animate-blob-slow mix-blend-screen" />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={2000}
              animationEasing="ease-out"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                fontSize: '12px',
                color: '#fafafa',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#fafafa', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>

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
