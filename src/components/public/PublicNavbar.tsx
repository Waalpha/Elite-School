import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  ShieldCheck,
  Sparkles,
  Layers,
  Phone,
  Mail,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Building2,
  Lock,
  LogIn,
  UserCheck,
} from "lucide-react";

interface PublicNavbarProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
  onOpenNewTenantModal: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
  onOpenNewTenantModal,
}) => {
  const { platformConfig, setViewMode, currentTenant, tenants, setCurrentTenant } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-b border-indigo-900/40 text-[11px] py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>DAVETECH Cloud Solutions: School ERP • POS Retail • High-Converting Websites • Custom Software</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <a href={`tel:${platformConfig.supportPhone || "+254700000000"}`} className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{platformConfig.supportPhone || "+254 700 000 000"}</span>
            </a>
            <span>•</span>
            <a href={`mailto:${platformConfig.supportEmail || "davmuchiri48@gmail.com"}`} className="hover:text-white flex items-center gap-1">
              <Mail className="w-3 h-3 text-indigo-400" />
              <span>{platformConfig.supportEmail || "davmuchiri48@gmail.com"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={platformConfig.logo}
              alt={platformConfig.name}
              className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1 group-hover:border-indigo-500 transition-colors shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-white group-hover:text-indigo-400 transition-colors">
                  {platformConfig.brandName}
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-1.5 py-0.2 rounded border border-indigo-500/30">
                  SOLUTIONS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[170px] sm:max-w-xs">
                {platformConfig.tagline || "Enterprise Software & Cloud Systems"}
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPackagesDropdownOpen(!packagesDropdownOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors py-2"
              >
                <span>Our 4 Flagship Packages</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {packagesDropdownOpen && (
                <div
                  onMouseLeave={() => setPackagesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("school-erp-section");
                      setPackagesDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-colors">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300">School ERP & Cloud OS</div>
                      <div className="text-[10px] text-slate-400">CBC grading, fees, QR attendance, portals</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("pos-system-section");
                      setPackagesDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300">POS & Retail Inventory</div>
                      <div className="text-[10px] text-slate-400">Barcode scan, M-Pesa STK, Z-reports</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("business-website-section");
                      setPackagesDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-300">Business Websites & CMS</div>
                      <div className="text-[10px] text-slate-400">High-converting SEO, custom domain & SSL</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("custom-software-section");
                      setPackagesDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-left flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">Custom Software & Cloud</div>
                      <div className="text-[10px] text-slate-400">Mobile apps, FinTech APIs, custom workflows</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("live-demos-hub")}
              className="hover:text-white transition-colors"
            >
              Interactive Demos
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("comparison-matrix")}
              className="hover:text-white transition-colors"
            >
              Package Comparison
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("case-studies")}
              className="hover:text-white transition-colors"
            >
              Case Studies
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contact-quote")}
              className="hover:text-white transition-colors"
            >
              Pricing & Quote
            </button>
          </div>

          {/* Action CTAs: Login Page & Backend Launch */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Direct Login Page Button */}
            <button
              id="header_portal_login_button"
              type="button"
              onClick={() => setViewMode("login")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Sign in with Google or Account Credentials"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portal Login</span>
            </button>

            {/* Direct Backend Entry */}
            <button
              id="header_launch_backend_erp"
              type="button"
              onClick={() => setViewMode("erp")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              title="Launch School ERP Backend Admin & Workspace"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Enter ERP Backend</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("platform")}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
              title="Super-Admin Platform Hub"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Platform Hub</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setViewMode("login")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-bold"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setViewMode("erp")}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold"
            >
              ERP Backend
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">
            Our Software Packages
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => scrollToSection("school-erp-section")}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>School ERP</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("pos-system-section")}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>POS System</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("business-website-section")}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Business Web</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("custom-software-section")}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Custom Software</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setViewMode("login")}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Sign In / Client Portal Login</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("erp")}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Enter School ERP Backend Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("platform")}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DAVETECH Platform Super-Admin Hub</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
