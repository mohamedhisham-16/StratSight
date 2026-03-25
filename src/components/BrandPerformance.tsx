"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Swiggy', value: 42, color: '#f1592a' },
  { name: 'Zomato', value: 38, color: '#cb202d' },
  { name: 'Blinkit', value: 12, color: '#f7d301' },
  { name: 'Others', value: 8, color: '#3f3f46' },
];

export function BrandPerformance() {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 h-full flex flex-col group relative overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
          Brand Performance
        </h3>
        <p className="text-sm text-zinc-500">Market Share Distribution</p>
      </div>

      <div className="flex-1 min-h-[160px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#fafafa' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-zinc-100 leading-none">35%</span>
          <span className="text-[10px] text-zinc-500 uppercase font-semibold">Your Share</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-4">
        {data.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-zinc-400 truncate">{item.name}</span>
            <span className="ml-auto text-xs font-bold text-zinc-200">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/5 blur-3xl rounded-full" />
    </div>
  );
}
