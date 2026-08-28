import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { DAVETECH_PACKAGES } from "../../data/packagesData";
import type { SoftwarePackageId } from "../../types";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  Calculator,
  ChevronRight,
  Building2,
  Barcode,
} from "lucide-react";

interface HeroSectionProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
  onOpenNewTenantModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
  onOpenNewTenantModal,
}) => {
  const { platformConfig, setViewMode, tenants, setCurrentTenant } = useTenant();
  const [selectedHeroPackage, setSelectedHeroPackage] = useState<SoftwarePackageId>("school_erp");

  const currentPkg = DAVETECH_PACKAGES.find((p) => p.id === selectedHeroPackage) || DAVETECH_PACKAGES[0];

  const handleLaunchPackageDemo = (pkgId: SoftwarePackageId) => {
    if (pkgId === "school_erp") {
      setViewMode("erp");
    } else if (pkgId === "pos_system") {
      onOpenPosModal();
    } else if (pkgId === "business_website") {
      const el = document.getElementById("business-website-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (pkgId === "custom_software") {
      onOpenEstimatorModal();
    }
  };

  const getPackageIcon = (id: SoftwarePackageId) => {
    switch (id) {
      case "school_erp":
        return <GraduationCap className="w-5 h-5" />;
      case "pos_system":
        return <Store className="w-5 h-5" />;
      case "business_website":
        return <Globe className="w-5 h-5" />;
      case "custom_software":
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Headline & Trust Badges */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 shadow-sm text-xs font-semibold text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-white font-bold">{platformConfig.brandName} Enterprise Suite</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-400">4 Flagship Cloud Packages</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Enterprise Technology Built for Scale.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              School ERP, POS, Web & Custom Cloud.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            DAVETECH delivers battle-tested software systems across Kenya and East Africa. Choose from our complete educational ERP platform, fast retail POS system, high-converting corporate websites, or bespoke custom software engineering.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setViewMode("erp")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-indigo-600/30 transition-all cursor-pointer group"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Launch School ERP Backend Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenPosModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Try Live POS Terminal Simulator</span>
            </button>

            <button
              type="button"
              onClick={onOpenEstimatorModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>Calculate Custom Software Quote</span>
            </button>
          </div>
        </div>

        {/* 4-Package Interactive Stage Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md">
          {/* Tab Selector Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pb-6 border-b border-slate-800">
            {DAVETECH_PACKAGES.map((pkg) => {
              const isSelected = selectedHeroPackage === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedHeroPackage(pkg.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-b from-slate-800 to-slate-950 border-indigo-500/80 shadow-lg shadow-indigo-500/10 text-white"
                      : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {getPackageIcon(pkg.id)}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {pkg.id === "school_erp" && "1. School ERP & Cloud"}
                      {pkg.id === "pos_system" && "2. POS & Retail System"}
                      {pkg.id === "business_website" && "3. Business Websites"}
                      {pkg.id === "custom_software" && "4. Custom Software"}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {pkg.pricingStarting}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Package Showcase Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Left Info & Capabilities (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  <span>PACKAGE SHOWCASE</span>
                  <span>•</span>
                  <span>{currentPkg.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {currentPkg.name}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentPkg.description}
                </p>
              </div>

              {/* Key Highlight Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
                {currentPkg.highlightMetrics.map((m, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-lg sm:text-xl font-black text-white font-mono">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Top 4 Capabilities Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentPkg.capabilities.slice(0, 4).map((cap, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* CTA Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleLaunchPackageDemo(currentPkg.id)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-300" />
                  <span>
                    {currentPkg.id === "school_erp" && "Launch Live School ERP Backend"}
                    {currentPkg.id === "pos_system" && "Try Interactive POS Terminal Simulator"}
                    {currentPkg.id === "business_website" && "Explore Website Features & Templates"}
                    {currentPkg.id === "custom_software" && "Calculate Software Timeline & Cost"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#contact-quote"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  Request Quote & Onboarding
                </a>
              </div>
            </div>

            {/* Right Visual Image & Live Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                <img
                  src={currentPkg.heroImage}
                  alt={currentPkg.name}
                  className="w-full h-72 sm:h-84 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlay Float Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-white shadow-xl">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-indigo-300 uppercase font-mono tracking-wider">
                      {currentPkg.badge}
                    </span>
                    <span className="text-emerald-400 font-extrabold font-mono">
                      {currentPkg.pricingStarting}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold truncate">
                    {currentPkg.tagline}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>99.98% Cloud SLA Uptime</span>
                    <span className="text-white font-mono font-bold">Kenya & Global</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
