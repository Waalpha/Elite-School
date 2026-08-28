import React from "react";
import { DAVETECH_PACKAGES } from "../../data/packagesData";
import {
  Cpu,
  Smartphone,
  ShieldAlert,
  Cloud,
  FileCode,
  Layers,
  Terminal,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Calculator,
  GitBranch,
  Database,
  Lock,
} from "lucide-react";

interface CustomSoftwarePackageSectionProps {
  onOpenEstimatorModal: () => void;
}

export const CustomSoftwarePackageSection: React.FC<CustomSoftwarePackageSectionProps> = ({
  onOpenEstimatorModal,
}) => {
  const pkg = DAVETECH_PACKAGES.find((p) => p.id === "custom_software")!;

  const techStack = [
    { name: "React / Next.js", category: "Frontend Web" },
    { name: "TypeScript", category: "Type-Safe Core" },
    { name: "Flutter & Dart", category: "iOS & Android" },
    { name: "Node.js / Express", category: "Backend Engine" },
    { name: "Google Cloud Platform", category: "Cloud Infrastructure" },
    { name: "Firestore & PostgreSQL", category: "Distributed Data" },
    { name: "M-Pesa Daraja 3.0", category: "FinTech Gateway" },
    { name: "Docker & Kubernetes", category: "Containerization" },
  ];

  return (
    <section id="custom-software-section" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Cpu className="w-4 h-4" />
              <span>PACKAGE 4: BESPOKE ENGINEERING & CLOUD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Custom Software Development & Cloud Engineering
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Bespoke mobile applications (iOS & Android), complex financial APIs, automated business workflows, and enterprise cloud migrations tailored to your exact operational logic.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenEstimatorModal}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-purple-300" />
              <span>Calculate Project Cost & Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pkg.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                {feat.icon === "Smartphone" && <Smartphone className="w-6 h-6" />}
                {feat.icon === "ShieldAlert" && <ShieldAlert className="w-6 h-6" />}
                {feat.icon === "Cloud" && <Cloud className="w-6 h-6" />}
                {feat.icon === "Cpu" && <Cpu className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack Matrix & Architecture */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-white">Modern, Scalable Technology Stack</h3>
            <p className="text-xs text-slate-400">
              We build on industry-standard, production-proven enterprise technologies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors text-center space-y-1"
              >
                <div className="text-sm font-black text-white">{tech.name}</div>
                <div className="text-[11px] text-purple-400 font-mono">{tech.category}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Full Source Code Handover & Intellectual Property Protection (NDA)</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              <span>Continuous Integration / Automated Deployment (CI/CD)</span>
            </div>
          </div>
        </div>

        {/* Calculator Spotlight Banner */}
        <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Project Estimator</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Get an Instant Budget & Sprint Estimation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use our real-time software cost estimator to select your target platforms, architecture modules, and sprint velocity. Receive an instant estimate and request a consultation with our lead software architects.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto text-center">
            <button
              type="button"
              onClick={onOpenEstimatorModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-black shadow-2xl shadow-purple-600/40 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Calculator className="w-5 h-5" />
              <span>Launch Software Cost Estimator</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
