import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { DAVETECH_PACKAGES } from "../../data/packagesData";
import type { Tenant } from "../../types";
import {
  GraduationCap,
  CreditCard,
  QrCode,
  Calendar,
  Layers,
  Globe,
  Building2,
  Users,
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Play,
  Copy,
  Check,
  Plus,
} from "lucide-react";

interface SchoolErpPackageSectionProps {
  onOpenNewTenantModal: () => void;
}

export const SchoolErpPackageSection: React.FC<SchoolErpPackageSectionProps> = ({
  onOpenNewTenantModal,
}) => {
  const { platformConfig, tenants, currentTenant, setCurrentTenant, setViewMode, getTenantSubdomainUrl } =
    useTenant();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pkg = DAVETECH_PACKAGES.find((p) => p.id === "school_erp")!;

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.subdomain && t.subdomain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLaunchTenantERP = (t: Tenant) => {
    setCurrentTenant(t);
    setViewMode("erp");
  };

  const handleViewTenantWebsite = (t: Tenant) => {
    setCurrentTenant(t);
    setViewMode("website");
  };

  const handleCopySubdomain = (t: Tenant, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getTenantSubdomainUrl(t);
    navigator.clipboard.writeText(url);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="school-erp-section" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <GraduationCap className="w-4 h-4" />
              <span>PACKAGE 1: EDUCATIONAL CLOUD OS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              DAVETECH Multi-Tenant School ERP
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              From Pre-Primary CBC rubrics and Junior Secondary continuous assessments to TVET modular grading and multi-campus universities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("erp")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Launch Live School ERP Backend</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Grid: 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pkg.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                {feat.icon === "GraduationCap" && <GraduationCap className="w-6 h-6" />}
                {feat.icon === "CreditCard" && <CreditCard className="w-6 h-6" />}
                {feat.icon === "QrCode" && <QrCode className="w-6 h-6" />}
                {feat.icon === "Building2" && <Building2 className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Capabilities List */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Full School ERP Module Suite</h3>
              <p className="text-xs text-slate-400">Pre-installed and isolated per school tenant cloud instance.</p>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              100% Kenyan CBC & TVET Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pkg.capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tenant Institutional Directory */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Live Connected School Clouds</span>
                <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  {tenants.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any school below to launch directly into its dedicated ERP backend workspace or public website.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter institutions..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={onOpenNewTenantModal}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Provision Tenant</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((t) => {
              const sub = (t.subdomain || t.code || "tenant").toLowerCase();
              const isCurrent = currentTenant?.id === t.id;
              return (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? "bg-slate-950 border-indigo-500 shadow-xl shadow-indigo-500/10"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <img
                        src={t.logo}
                        alt={t.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900"
                      />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {t.type.replace("_", " ")}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] text-indigo-400 font-bold mt-1">
                            ● Active Selected
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white line-clamp-1">{t.name}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <span className="font-semibold text-slate-300">{t.code}</span>
                        <span>•</span>
                        <span className="truncate">{t.address || "Kenya"}</span>
                      </div>
                    </div>

                    {/* Subdomain Pill */}
                    <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-xs font-mono">
                      <span className="text-indigo-300 truncate font-semibold">
                        {sub}.davetecherp.com
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopySubdomain(t, e)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                        title="Copy Subdomain"
                      >
                        {copiedId === t.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleLaunchTenantERP(t)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Launch ERP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewTenantWebsite(t)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Public Site</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
