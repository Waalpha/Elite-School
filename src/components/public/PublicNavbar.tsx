import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import {
  Menu,
  X,
  ArrowRight,
  LogIn,
  Code2,
  Phone,
  MessageSquare,
} from "lucide-react";

interface PublicNavbarProps {
  onOpenPosModal?: () => void;
  onOpenEstimatorModal?: () => void;
  onOpenNewTenantModal?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = () => {
  const { platformConfig, setViewMode } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name: DAVETECH Solutions */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {platformConfig.brandName || "DAVETECH"}
                </span>
                <span className="text-sm sm:text-base font-bold text-indigo-600">
                  Solutions
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Kenyan Software & Cloud Systems
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("solutions")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Solutions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("why-davetech")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone quick link */}
            <a
              href="tel:0707760239"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>0707760239</span>
            </a>

            <button
              type="button"
              onClick={() => setViewMode("login")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Client Login</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-indigo-600/25 transition-all cursor-pointer hover:shadow-md"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setViewMode("login")}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <button
              type="button"
              onClick={() => scrollToSection("hero")}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("solutions")}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
            >
              Solutions
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("why-davetech")}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
            >
              Contact
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-slate-900">Direct Support Hotline:</div>
            <div className="flex items-center gap-3">
              <a href="tel:0707760239" className="font-bold text-indigo-600 font-mono">0707760239</a>
              <span>/</span>
              <a href="tel:0719176549" className="font-bold text-indigo-600 font-mono">0719176549</a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setViewMode("login")}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Client Login</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
