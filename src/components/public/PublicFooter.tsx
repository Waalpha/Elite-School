import React from "react";
import { useTenant } from "../../context/TenantContext";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  ShieldCheck,
  Layers,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";

interface PublicFooterProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
}) => {
  const { platformConfig, setViewMode } = useTenant();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={platformConfig.logo}
                alt={platformConfig.name}
                className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
                }}
              />
              <div>
                <div className="text-base font-black tracking-wider text-white">
                  {platformConfig.brandName}
                </div>
                <div className="text-[10px] text-indigo-400 font-mono">
                  SOLUTIONS & CLOUD SYSTEMS
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Enterprise technology ecosystem powering educational institutions, retail point of sales, high-converting digital corporate brands, and custom software systems across Kenya & East Africa.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("erp")}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>Enter School ERP Backend</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("platform")}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Super-Admin Hub
              </button>
            </div>
          </div>

          {/* Col 2: Software Packages */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Software Packages
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("school-erp-section")}
                  className="hover:text-indigo-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>1. School ERP & Cloud</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("pos-system-section")}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. POS & Retail System</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("business-website-section")}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>3. Business Websites & CMS</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("custom-software-section")}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>4. Custom Software Dev</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Interactive Tools */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Tools
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setViewMode("erp")}
                  className="hover:text-white transition-colors"
                >
                  Live School ERP Backend
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPosModal}
                  className="hover:text-white transition-colors"
                >
                  Live POS Terminal Simulator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEstimatorModal}
                  className="hover:text-white transition-colors"
                >
                  Software Quotation Estimator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo("comparison-matrix")}
                  className="hover:text-white transition-colors"
                >
                  Package Comparison Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Inquiries */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Inquiries
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${platformConfig.supportPhone || "+254700000000"}`}
                  className="hover:text-white font-mono"
                >
                  {platformConfig.supportPhone || "+254 700 000 000"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a
                  href={`mailto:${platformConfig.supportEmail || "davmuchiri48@gmail.com"}`}
                  className="hover:text-white font-mono truncate max-w-[170px]"
                >
                  {platformConfig.supportEmail || "davmuchiri48@gmail.com"}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{platformConfig.address || "Nairobi, Kenya"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & security bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {platformConfig.name} ({platformConfig.brandName}). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Multi-Tenant Firestore Cloud Persistence</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">99.98% Cloud SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
