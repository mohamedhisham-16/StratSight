"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Building2, Globe, TrendingUp, Users, Target } from "lucide-react";
import { cn } from "../lib/utils";

const DOMAINS = [
  "Aerospace", "AgriTech", "Automotive", "Cybersecurity", "Defense", 
  "E-commerce", "EdTech", "EV Infra", "EV Mobility", "FinTech", 
  "FMCG", "HealthTech", "Hospitality", "Industrials", "InsurTech", 
  "IT Services", "Logistics", "Metals", "Mining", "Pharma", 
  "PropTech", "Renewables", "SaaS", "Travel"
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    domain: "",
    region: "india_national",
    scale: "enterprise",
    competitors: ""
  });
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDomains = DOMAINS.filter(d => 
    d.toLowerCase().includes(formData.domain.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) return;
    
    setIsLoading(true);
    
    // Save to localStorage for mock usage in dashboard
    try {
      localStorage.setItem("stratsight_company_name", formData.companyName);
      localStorage.setItem("stratsight_domain", formData.domain);
      localStorage.setItem("stratsight_region", formData.region);
      localStorage.setItem("stratsight_scale", formData.scale);
    } catch(e) {}
    
    // Simulate API delay for a premium feel
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Premium Ambient Background Orbs */}
      <div className="fixed top-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/20 blur-[120px] rounded-full animate-blob mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[10%] right-[20%] w-[30%] h-[30%] bg-fuchsia-600/20 blur-[150px] rounded-full animate-blob-slow mix-blend-screen pointer-events-none" />

      {/* Header */}
      <div className="text-center relative mb-8 w-full">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="h-4 w-4" />
          Initialize Workspace
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-fuchsia-400 to-rose-400 drop-shadow-lg">StratSight</span>
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          Configure your intelligence parameters to generate your personalized command center.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-[2rem] relative overflow-hidden backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full max-w-xl text-center">
        
        {/* Decorative Inner Glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col items-center">
          
          {/* Company Name */}
          <div className="space-y-3 group w-full">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              Company Name
            </label>
            <input 
              required
              type="text"
              placeholder="e.g. Acme Corporation"
              style={{ textAlignLast: 'center' }}
              className="w-full bg-white/[0.03] border border-white/10 focus:border-indigo-500/60 rounded-2xl px-6 py-4 text-center text-lg md:text-xl font-medium text-white placeholder-zinc-600 focus:outline-hidden transition-all group-focus-within:bg-white/[0.06] group-focus-within:shadow-[0_0_30px_rgba(99,102,241,0.15)] shadow-inner"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div className="w-full h-px bg-white/5 my-2" />

          {/* Domain & Region Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="space-y-3 group">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Target className="h-4 w-4 text-violet-400" />
                Target Domain
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. SaaS"
                  style={{ textAlignLast: 'center' }}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-violet-500/60 rounded-2xl px-4 py-3.5 text-center text-white placeholder-zinc-600 focus:outline-hidden transition-all group-focus-within:bg-white/[0.06] group-focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)] shadow-inner"
                  value={formData.domain}
                  onChange={(e) => {
                    setFormData({...formData, domain: e.target.value});
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
                          className="px-4 py-3 text-sm text-zinc-300 hover:bg-violet-500/20 hover:text-white cursor-pointer transition-colors text-center border-b border-white/5 last:border-0"
                          onClick={() => {
                            setFormData({...formData, domain: option});
                            setIsDomainOpen(false);
                          }}
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                        No matches found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 group">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                Region Focus
              </label>
              <select 
                title="Region"
                style={{ textAlignLast: 'center' }}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 rounded-2xl px-4 py-3.5 text-center text-white cursor-pointer focus:outline-hidden transition-all group-focus-within:bg-white/[0.06] group-focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] shadow-inner appearance-none"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              >
                <option value="india_national" className="bg-[#0f0f11]">India (National)</option>
                <option value="global" className="bg-[#0f0f11]">Global</option>
                <option value="apac" className="bg-[#0f0f11]">APAC</option>
                <option value="na" className="bg-[#0f0f11]">North America</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="space-y-3 group">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                Scale
              </label>
              <select 
                title="Scale"
                style={{ textAlignLast: 'center' }}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-amber-500/60 rounded-2xl px-4 py-3.5 text-center text-white cursor-pointer focus:outline-hidden transition-all group-focus-within:bg-white/[0.06] group-focus-within:shadow-[0_0_20px_rgba(245,158,11,0.15)] shadow-inner appearance-none"
                value={formData.scale}
                onChange={(e) => setFormData({...formData, scale: e.target.value})}
              >
                <option value="enterprise" className="bg-[#0f0f11]">Enterprise</option>
                <option value="mid_market" className="bg-[#0f0f11]">Mid-Market</option>
                <option value="startup" className="bg-[#0f0f11]">Startup</option>
              </select>
            </div>

            <div className="space-y-3 group">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-rose-400" />
                Seed Competitors
              </label>
              <input 
                type="text"
                placeholder="e.g. Swiggy, Zomato"
                style={{ textAlignLast: 'center' }}
                className="w-full bg-white/[0.03] border border-white/10 focus:border-rose-500/60 rounded-2xl px-4 py-3.5 text-center text-white placeholder-zinc-600 focus:outline-hidden transition-all group-focus-within:bg-white/[0.06] group-focus-within:shadow-[0_0_20px_rgba(244,63,94,0.15)] shadow-inner"
                value={formData.competitors}
                onChange={(e) => setFormData({...formData, competitors: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!formData.companyName || isLoading}
            className="w-full mt-6 relative px-8 py-4 rounded-2xl text-white text-base font-extrabold shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 group overflow-hidden bg-indigo-600 hover:bg-indigo-500 transition-all border border-indigo-400/50 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse text-indigo-300" />
                  Generating Command Center...
                </>
              ) : (
                <>
                  PROCEED
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
