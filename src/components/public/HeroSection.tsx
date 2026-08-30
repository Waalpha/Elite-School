import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  Barcode,
  Smartphone,
  ShieldCheck,
  Database,
  Layers,
  Activity,
  Check,
} from "lucide-react";

interface HeroSectionProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
  onOpenNewTenantModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
}) => {
  const { setViewMode } = useTenant();
  const [hoveredSolution, setHoveredSolution] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100"
    >
      {/* Subtle ambient lighting & refined background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100/40 via-purple-100/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-sky-100/30 via-indigo-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Headline, Subtitle, Key Pillars, CTAs & Contact Details */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 text-left">
            
            {/* Small Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 text-xs font-bold text-indigo-700 tracking-wide uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>KENYAN SOFTWARE & TECHNOLOGY SOLUTIONS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] font-black tracking-tight text-slate-900 leading-[1.12]">
              Technology Built for the Way{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700">
                Your Business Works.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              School ERP systems, POS solutions, professional websites and custom software designed for modern businesses in Kenya.
            </p>

            {/* 4 Core Pillars Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>CBC School ERP</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>M-Pesa POS Systems</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Check className="w-4 h-4 text-sky-600 shrink-0" />
                <span>High-Speed Websites</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Custom Cloud Systems</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-sm font-bold shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>View Our Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all shadow-xs cursor-pointer"
              >
                <span>Get a Free Quote</span>
              </button>
            </div>

            {/* Direct Contact & Location Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thika & Nairobi, Kenya</span>
                </div>
                
                <div className="flex items-center gap-2 font-mono text-slate-800 font-bold">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <a href="tel:0707760239" className="hover:text-indigo-600 transition-colors">
                    0707760239
                  </a>
                  <span>/</span>
                  <a href="tel:0719176549" className="hover:text-indigo-600 transition-colors">
                    0719176549
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <a
                  href="https://wa.me/254707760239?text=Hello%20DAVETECH%2C%20I%20am%20inquiring%20about%20your%20software%20solutions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp direct: 0707760239</span>
                </a>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Large Visual Composition Showing 4 Connected Solutions */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="relative">
              
              {/* Outer Decorative Glow Container */}
              <div className="relative bg-slate-50/80 p-3 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 backdrop-blur-xs">
                
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200/80 mb-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-600 ml-1">
                      DAVETECH SOLUTIONS SUITE
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    <Activity className="w-3 h-3 text-indigo-600 animate-pulse" />
                    <span>Active Ecosystem</span>
                  </div>
                </div>

                {/* 2x2 Bento Grid of 4 Connected Solution Mockups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* ----------------------------------------------------------------- */}
                  {/* SOLUTION 1: SCHOOL ERP */}
                  {/* ----------------------------------------------------------------- */}
                  <div
                    onMouseEnter={() => setHoveredSolution("erp")}
                    onMouseLeave={() => setHoveredSolution(null)}
                    onClick={() => setViewMode("erp")}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                              SCHOOL ERP
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              CBC & Academic Operations
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          Education
                        </span>
                      </div>

                      {/* Mockup Preview Body */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 text-left">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-700">
                          <span>Grade 8 Integrated Science</span>
                          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">EE (86%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full w-[86%] rounded-full" />
                        </div>
                        <div className="flex items-center justify-between text-[9px] pt-1 text-slate-600">
                          <span className="truncate">M-Pesa Fee: #KCA-8192</span>
                          <span className="font-mono font-bold text-emerald-700">KES 24,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA trigger */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
                      <span>Launch Live Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* ----------------------------------------------------------------- */}
                  {/* SOLUTION 2: POS SYSTEMS */}
                  {/* ----------------------------------------------------------------- */}
                  <div
                    onMouseEnter={() => setHoveredSolution("pos")}
                    onMouseLeave={() => setHoveredSolution(null)}
                    onClick={onOpenPosModal}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                            <Store className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                              POS SYSTEMS
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              Retail & M-Pesa Counter
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Retail
                        </span>
                      </div>

                      {/* Mockup Preview Body */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 text-left">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-700">
                          <span className="flex items-center gap-1">
                            <Barcode className="w-3 h-3 text-emerald-600" />
                            <span>Barcode Scanner</span>
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">Ready</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-600">
                          <span className="truncate">2x School Uniform Sets</span>
                          <span className="font-mono font-bold text-slate-900">KES 4,800</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] bg-emerald-600 text-white px-2 py-1 rounded-lg font-bold">
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5" />
                            <span>M-Pesa STK Push</span>
                          </span>
                          <span className="font-mono">KES 4,800</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA trigger */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                      <span>Try POS Simulator</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* ----------------------------------------------------------------- */}
                  {/* SOLUTION 3: WEBSITES */}
                  {/* ----------------------------------------------------------------- */}
                  <div
                    onMouseEnter={() => setHoveredSolution("web")}
                    onMouseLeave={() => setHoveredSolution(null)}
                    onClick={() => scrollToSection("solutions")}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-sky-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors">
                              WEBSITES
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              Fast Conversion Portals
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                          Digital
                        </span>
                      </div>

                      {/* Mockup Preview Body */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 text-left">
                        <div className="bg-white rounded-lg p-1.5 border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-1.5 bg-slate-300 rounded" />
                            <div className="w-4 h-1.5 bg-sky-400 rounded" />
                          </div>
                          <div className="w-3/4 h-2 bg-slate-800 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[9px] text-center pt-0.5">
                          <div className="bg-white border border-slate-200/80 rounded py-0.5 font-medium text-slate-700">
                            <span className="font-bold text-emerald-600">98/100</span> PageSpeed
                          </div>
                          <div className="bg-white border border-slate-200/80 rounded py-0.5 font-medium text-slate-700 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-sky-600" />
                            <span>SSL Security</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA trigger */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600">
                      <span>View Web Plans</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* ----------------------------------------------------------------- */}
                  {/* SOLUTION 4: CUSTOM SOFTWARE */}
                  {/* ----------------------------------------------------------------- */}
                  <div
                    onMouseEnter={() => setHoveredSolution("custom")}
                    onMouseLeave={() => setHoveredSolution(null)}
                    onClick={onOpenEstimatorModal}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                              CUSTOM SOFTWARE
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              Tailored Cloud Pipelines
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                          Bespoke
                        </span>
                      </div>

                      {/* Mockup Preview Body */}
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5 text-left">
                        <div className="bg-white rounded-lg p-1.5 border border-slate-200/80 space-y-1 text-[9px]">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="font-semibold truncate">Custom API Automation</span>
                            <span className="text-emerald-600 font-bold">Live</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Database className="w-2.5 h-2.5 text-purple-600" />
                            <span className="truncate">PostgreSQL • Role-Based Auth</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] px-2 py-0.5 rounded bg-purple-50 text-purple-900 font-semibold border border-purple-100/70">
                          <span>Dedicated Kenya Support</span>
                          <span className="font-mono text-[8px] bg-purple-200/60 px-1 rounded">SLA</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA trigger */}
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
                      <span>Calculate Quote</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                </div>

                {/* Bottom Ecosystem Status Pill */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-semibold text-slate-700 text-[11px]">
                      Integrated Kenyan Cloud Software
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Click any solution above to explore interactive demo
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
