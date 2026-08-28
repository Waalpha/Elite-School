import React from "react";
import { DAVETECH_PACKAGES } from "../../data/packagesData";
import {
  Store,
  Zap,
  Smartphone,
  PackageCheck,
  BarChart3,
  Receipt,
  Barcode,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Layers,
  Coins,
  Cpu,
  Printer,
  ShoppingBag,
} from "lucide-react";

interface PosSystemPackageSectionProps {
  onOpenPosModal: () => void;
}

export const PosSystemPackageSection: React.FC<PosSystemPackageSectionProps> = ({
  onOpenPosModal,
}) => {
  const pkg = DAVETECH_PACKAGES.find((p) => p.id === "pos_system")!;

  const industries = [
    { name: "Supermarkets & Minimarts", desc: "Fast barcode checkout, multi-lane registers & bulk inventory." },
    { name: "Pharmacies & Chemists", desc: "Batch numbers, expiry date tracking & prescription management." },
    { name: "Hardware & Building Supplies", desc: "Unit conversions (kg, pcs, meters), contractor invoicing." },
    { name: "Boutiques & Apparel", desc: "Color/size variants, custom barcode label printing." },
    { name: "Restaurants, Cafes & Bars", desc: "Table orders, kitchen display tickets & split bill payments." },
    { name: "Wholesale & Distributors", desc: "Tiered wholesale pricing, customer credit balances & delivery notes." },
  ];

  return (
    <section id="pos-system-section" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Store className="w-4 h-4" />
              <span>PACKAGE 2: RETAIL & WHOLESALE POS CLOUD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              DAVETECH Point of Sale (POS) & Inventory System
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Transform your store checkout with sub-3-second barcode scanning, automatic M-Pesa STK push, real-time stock replenishment, and multi-branch synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenPosModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs sm:text-sm font-black shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Live POS Terminal Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pkg.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                {feat.icon === "Zap" && <Zap className="w-6 h-6" />}
                {feat.icon === "Smartphone" && <Smartphone className="w-6 h-6" />}
                {feat.icon === "PackageCheck" && <PackageCheck className="w-6 h-6" />}
                {feat.icon === "BarChart3" && <BarChart3 className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live Simulator Spotlight Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive In-Browser Experience</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Try Scanning, Adding Products & M-Pesa STK Checkout
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the ultra-responsive cashier interface before deploying to your retail store. Test real-time barcode lookups, discount calculations, M-Pesa STK prompts, and thermal receipt rendering.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Latency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ESC/POS Printing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Shift Z-Reports</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto text-center">
            <button
              type="button"
              onClick={onOpenPosModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black shadow-2xl shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Store className="w-5 h-5" />
              <span>Open Live POS Register Simulator</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Free interactive simulator • No registration required
            </p>
          </div>
        </div>

        {/* Industry Match Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-white">Tailored for Every Retail & Wholesale Business</h3>
            <p className="text-xs text-slate-400">
              Pre-configured workflows for fast-paced retail stores across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>{ind.name}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Compatibility */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-400" />
              <span>Universal Hardware Compatibility</span>
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl">
              DAVETECH POS operates seamlessly on Touch POS All-in-Ones, Sunmi Android handheld registers, iPads/Tablets, Windows PCs, 58mm/80mm USB/Bluetooth thermal printers, and standard laser barcode scanners.
            </p>
          </div>
          <a
            href="#contact-quote"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            Inquire About POS Hardware Bundles
          </a>
        </div>
      </div>
    </section>
  );
};
