import React from "react";
import {
  Play,
  Zap,
  Layers,
  Store,
  Globe,
  Cpu,
  Calculator,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface LiveDemosHubProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
  onLaunchERP: () => void;
}

export const LiveDemosHub: React.FC<LiveDemosHubProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
  onLaunchERP,
}) => {
  const demos = [
    {
      id: "erp_demo",
      title: "1. School ERP & Multi-Tenant OS",
      badge: "Live Backend",
      color: "indigo",
      icon: Layers,
      description:
        "Access the full educational cloud workspace. Test CBC rubric assessment entry, multi-votehead fee collections with M-Pesa reconciliation, QR attendance tracking, and student report card generators.",
      actionLabel: "Launch Live ERP Backend",
      onClick: onLaunchERP,
    },
    {
      id: "pos_demo",
      title: "2. Point of Sale (POS) Terminal",
      badge: "Interactive Simulator",
      color: "emerald",
      icon: Store,
      description:
        "Experience our lightning-fast cashier interface. Add grocery & electronics products to the cart, simulate laser barcode scanning, apply discounts, and trigger simulated M-Pesa STK push payments & thermal receipts.",
      actionLabel: "Open POS Register Simulator",
      onClick: onOpenPosModal,
    },
    {
      id: "website_demo",
      title: "3. High-Converting Business Web",
      badge: "Template Explorer",
      color: "sky",
      icon: Globe,
      description:
        "Preview modern corporate, healthcare clinic, legal practice, and hotel website layouts. Experience sub-second loading speeds, zero-code CMS editors, and integrated WhatsApp lead capture funnels.",
      actionLabel: "Explore Website Templates",
      onClick: () => {
        const el = document.getElementById("business-website-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "estimator_demo",
      title: "4. Custom Software Estimator",
      badge: "Instant Calculator",
      color: "purple",
      icon: Calculator,
      description:
        "Design your custom mobile app, FinTech API integration, or enterprise cloud microservice. Select platforms and capabilities to calculate estimated engineering sprints, cost in KES/USD, and timeline.",
      actionLabel: "Calculate Project Scope",
      onClick: onOpenEstimatorModal,
    },
  ];

  return (
    <section id="live-demos-hub" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>HANDS-ON INTERACTIVE EXPERIENCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Test Our 4 Software Packages in Real-Time
          </h2>
          <p className="text-sm text-slate-300">
            Experience our software interfaces and computational engines directly in your browser.
          </p>
        </div>

        {/* 4 Interactive Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <div
                key={demo.id}
                className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        demo.color === "indigo"
                          ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                          : demo.color === "emerald"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : demo.color === "sky"
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950 text-slate-300 px-3 py-1 rounded-full border border-slate-800">
                      {demo.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={demo.onClick}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      demo.color === "indigo"
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                        : demo.color === "emerald"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
                        : demo.color === "sky"
                        ? "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30"
                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{demo.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
