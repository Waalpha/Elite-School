import React from "react";
import { useTenant } from "../../context/TenantContext";
import {
  Code2,
  Phone,
  Mail,
  MapPin,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface PublicFooterProps {
  onOpenPosModal?: () => void;
  onOpenEstimatorModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = () => {
  const { platformConfig, setViewMode } = useTenant();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  {platformConfig.brandName || "DAVETECH"} Solutions
                </span>
              </div>
            </div>

            <p className="text-base text-slate-300 font-semibold italic">
              "Software. Websites. Systems that work."
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              We design and engineer high-performance school ERP systems, retail POS solutions, professional corporate websites, and custom cloud software across Kenya.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("login")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client Portal Login</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("erp")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold border border-indigo-500/40 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>School ERP Backend</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Quick Navigation
            </div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("hero")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("solutions")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("why-davetech")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="hover:text-indigo-400 transition-colors cursor-pointer font-medium text-slate-300"
                >
                  Client Login →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Contact & Location
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Thika, Kenya</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-2">
                  <a href="tel:0707760239" className="hover:text-white font-mono text-slate-200">
                    0707760239
                  </a>
                  <span>/</span>
                  <a href="tel:0719176549" className="hover:text-white font-mono text-slate-200">
                    0719176549
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <a href="mailto:support@davetech.co.ke" className="hover:text-white font-mono text-slate-200">
                  support@davetech.co.ke
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setViewMode("platform")}
                className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center gap-1 transition-colors"
                title="Super-Admin Platform Hub"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super-Admin Hub</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} DAVETECH Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Thika, Kenya</span>
            <span>•</span>
            <span>0707760239 / 0719176549</span>
            <span>•</span>
            <span>support@davetech.co.ke</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
