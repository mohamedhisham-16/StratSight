"use client";

import { useState, useEffect } from "react";
import { Settings2, Save, Globe, TrendingUp, Target } from "lucide-react";
import { cn } from "../../../lib/utils";

const DOMAINS = [
  "Aerospace", "AgriTech", "Automotive", "Cybersecurity", "Defense", 
  "E-commerce", "EdTech", "EV Infra", "EV Mobility", "FinTech", 
  "FMCG", "HealthTech", "Hospitality", "Industrials", "InsurTech", 
  "IT Services", "Logistics", "Metals", "Mining", "Pharma", 
  "PropTech", "Renewables", "SaaS", "Travel"
];

export default function TrackingParametersPage() {
  const [domain, setDomain] = useState("");
  const [region, setRegion] = useState("india_national");
  const [scale, setScale] = useState("enterprise");
  const [isSaved, setIsSaved] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);

  const filteredDomains = DOMAINS.filter(d => 
    d.toLowerCase().includes(domain.toLowerCase())
  );

  useEffect(() => {
    setDomain(localStorage.getItem("stratsight_domain") || "");
    setRegion(localStorage.getItem("stratsight_region") || "india_national");
    setScale(localStorage.getItem("stratsight_scale") || "enterprise");
  }, []);

  const handleSave = () => {
    localStorage.setItem("stratsight_domain", domain);
    localStorage.setItem("stratsight_region", region);
    localStorage.setItem("stratsight_scale", scale);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 relative z-10 w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-indigo-400" />
            Tracking Parameters
          </h1>
          <p className="text-zinc-400 text-base">
            Manage your AI intelligence bounds, localized region tracking, and target scale.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className={cn(
            "relative px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 flex items-center gap-2 group transition-all",
            isSaved 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/25" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-400/50 shadow-indigo-500/25"
          )}
        >
          {isSaved ? (
            <>Saved Successfully</>
          ) : (
            <>
              <Save className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              Save Changes
            </>
          )}
        </button>
      </section>

      {/* Form Container */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -z-10" />

        <div className="space-y-8 relative z-10 max-w-2xl">
          {/* Domain */}
          <div className="space-y-3 group">
            <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-400" />
              Target Domain
            </label>
            <p className="text-xs text-zinc-500">The primary industry sector your intelligence gathering focuses on.</p>
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="e.g. SaaS"
                className="w-full bg-white/[0.03] border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-hidden transition-all group-focus-within:bg-white/[0.05] shadow-inner"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setIsDomainOpen(true);
                }}
                onFocus={() => setIsDomainOpen(true)}
                onBlur={() => setTimeout(() => setIsDomainOpen(false), 200)}
              />
              
              {isDomainOpen && (
                <div className="absolute top-full mt-2 left-0 w-full max-h-48 overflow-y-auto bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                  {filteredDomains.length > 0 ? (
                    filteredDomains.map((option) => (
                      <div 
                        key={option}
                        className="px-4 py-3 text-sm text-zinc-300 hover:bg-violet-500/20 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0"
                        onClick={() => {
                          setDomain(option);
                          setIsDomainOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-zinc-500">
                      No matches found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Region */}
          <div className="space-y-3 group">
            <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              Geographic Region
            </label>
            <p className="text-xs text-zinc-500">Filters signals and market share indicators based on operations in this region.</p>
            <select 
              title="Region"
              className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-3.5 text-white cursor-pointer focus:outline-hidden transition-all group-focus-within:bg-white/[0.05] shadow-inner appearance-none"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="india_national" className="bg-[#0f0f11]">India (National)</option>
              <option value="global" className="bg-[#0f0f11]">Global</option>
              <option value="apac" className="bg-[#0f0f11]">APAC</option>
              <option value="na" className="bg-[#0f0f11]">North America</option>
            </select>
          </div>

          <div className="h-px w-full bg-white/5" />

          {/* Scale */}
          <div className="space-y-3 group">
            <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              Operational Scale
            </label>
            <p className="text-xs text-zinc-500">Tunes the AI analytics to calibrate relevance of competitor expansion moves.</p>
            <select 
              title="Scale"
              className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-3.5 text-white cursor-pointer focus:outline-hidden transition-all group-focus-within:bg-white/[0.05] shadow-inner appearance-none"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
            >
              <option value="enterprise" className="bg-[#0f0f11]">Enterprise</option>
              <option value="mid_market" className="bg-[#0f0f11]">Mid-Market</option>
              <option value="startup" className="bg-[#0f0f11]">Startup</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
