import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Tenant, PublicInquiry } from "../../types";
import { savePublicInquiry } from "../../services/firestoreService";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Layers,
  Globe,
  CreditCard,
  QrCode,
  Network,
  Search,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Lock,
  Copy,
  Check,
  Plus,
  Send,
  Star,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  Cpu,
  Zap,
} from "lucide-react";

interface DavetechMainPageProps {
  onOpenNewTenantModal: () => void;
}

export const DavetechMainPage: React.FC<DavetechMainPageProps> = ({
  onOpenNewTenantModal,
}) => {
  const {
    platformConfig,
    tenants,
    setCurrentTenant,
    setViewMode,
    getTenantSubdomainUrl,
  } = useTenant();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSolutionTab, setActiveSolutionTab] = useState<
    "primary" | "secondary" | "tvet" | "multicampus"
  >("primary");

  // Inquiries form state
  const [inquiryForm, setInquiryForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    institutionName: "",
    institutionType: "school_primary",
    message: "",
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subdomain && t.subdomain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.address && t.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedTypeFilter === "all" ||
      (selectedTypeFilter === "primary" &&
        (t.type === "school_primary" || t.type === "school_junior")) ||
      (selectedTypeFilter === "college" &&
        (t.type === "college_tvet" || t.type === "university")) ||
      t.type === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleCopySubdomain = (t: Tenant, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getTenantSubdomainUrl(t);
    navigator.clipboard.writeText(url);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName || !inquiryForm.email || !inquiryForm.phone) return;

    setSubmittingInquiry(true);
    try {
      const inquiry: PublicInquiry = {
        id: `inq_plat_${Date.now()}`,
        tenantId: "davetech_main",
        fullName: inquiryForm.fullName,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        programInterestedIn: `${inquiryForm.institutionName} (${inquiryForm.institutionType})`,
        message: inquiryForm.message || "Platform onboarding / demo requested.",
        status: "new",
        createdAt: new Date().toISOString(),
      };
      await savePublicInquiry(inquiry);
      setInquirySubmitted(true);
      setInquiryForm({
        fullName: "",
        email: "",
        phone: "",
        institutionName: "",
        institutionType: "school_primary",
        message: "",
      });
      setTimeout(() => setInquirySubmitted(false), 6000);
    } catch (err) {
      console.error("Inquiry error:", err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      {platformConfig.announcementBanner && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 border-b border-indigo-500/30 px-4 py-2 text-center text-xs font-semibold text-indigo-100 flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span>{platformConfig.announcementBanner}</span>
        </div>
      )}

      {/* 2. MAIN PLATFORM NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Platform Logo & Identity */}
          <div className="flex items-center gap-3.5">
            <img
              src={platformConfig.logo}
              alt={platformConfig.name}
              className="w-10 h-10 rounded-xl object-cover bg-white p-1 border border-indigo-500/40 shadow-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">
                  {platformConfig.brandName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                  Cloud OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-sm">
                {platformConfig.tagline}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#institutions-directory" className="hover:text-white transition-colors">
              Institutions ({tenants.length})
            </a>
            <a href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </a>
            <a href="#modules" className="hover:text-white transition-colors">
              ERP Engines
            </a>
            <a href="#pricing-plans" className="hover:text-white transition-colors">
              SaaS Pricing
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact Sales
            </a>
          </div>

          {/* Right Action Switchers */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode("platform")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs transition-all shadow-xs"
              title="Platform Master Administration"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Platform Admin</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewTenantModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision Tenant</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SHOWCASE */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.25),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Multi-Tenant Institutional Cloud Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-tight">
            {platformConfig.heroTitle}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {platformConfig.heroSubtitle}
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#institutions-directory"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Live Institutions ({tenants.length})</span>
            </a>

            <button
              type="button"
              onClick={onOpenNewTenantModal}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Onboard New Institution</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (tenants.length > 0) {
                  setCurrentTenant(tenants[0]);
                }
                setViewMode("erp");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Live ERP Workspace</span>
            </button>
          </div>

          {/* Platform Vital Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                {tenants.length}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Active Tenant Clouds
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {platformConfig.stats?.studentsCount?.toLocaleString() || "128,500+"}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Enrolled Learners & Students
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                {platformConfig.stats?.uptime || "99.98%"}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Firestore Cloud SLA Uptime
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                100%
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                Multi-Tenant Data Isolation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSTITUTION DIRECTORY & TENANT PORTALS */}
      <section
        id="institutions-directory"
        className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Multi-Tenant Cloud Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Institutional Portals & Subdomains
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct access for educators, students, and parents to enter their dedicated institutional ERP or public portal.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTypeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Organizations ({tenants.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter("primary")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTypeFilter === "primary"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Primary & Junior CBC
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter("college")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTypeFilter === "college"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              TVET & Colleges
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search school name, code, or subdomain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tenants Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((t) => {
            const sub = (t.subdomain || t.code || "tenant").toLowerCase();
            const isCopied = copiedId === t.id;

            return (
              <div
                key={t.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <img
                      src={t.logo}
                      alt={t.name}
                      className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-md shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160";
                      }}
                    />
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold uppercase tracking-wider">
                      {t.type.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {t.motto || "Excellence in holistic learning & training"}
                    </p>
                  </div>

                  {/* Subdomain Pill */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-750 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-bold truncate">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{sub}.davetecherp.com</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopySubdomain(t, e)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                      title="Copy Subdomain URL"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{t.address}</span>
                  </div>
                </div>

                {/* Direct Action Portal Launchers */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTenant(t);
                      setViewMode("erp");
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>Enter ERP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTenant(t);
                      setViewMode("website");
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Visit Public School Website & Admissions"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ARCHITECTURAL PILLARS & ERP MODULES */}
      <section
        id="modules"
        className="py-16 sm:py-20 bg-slate-950 border-y border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Core Platform Engines
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Built for Institutional Scale & Academic Rigor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Davetech replaces fragmented spreadsheets and legacy desktop software with a fully integrated multi-tenant cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformConfig.features?.map((feat) => {
              return (
                <div
                  key={feat.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-indigo-500/50 transition-all shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                    {feat.iconName === "Layers" && <Layers className="w-5 h-5" />}
                    {feat.iconName === "GraduationCap" && <GraduationCap className="w-5 h-5" />}
                    {feat.iconName === "CreditCard" && <CreditCard className="w-5 h-5" />}
                    {feat.iconName === "Globe" && <Globe className="w-5 h-5" />}
                    {feat.iconName === "QrCode" && <QrCode className="w-5 h-5" />}
                    {feat.iconName === "Network" && <Network className="w-5 h-5" />}
                    {!["Layers", "GraduationCap", "CreditCard", "Globe", "QrCode", "Network"].includes(feat.iconName) && (
                      <Cpu className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {feat.category}
                  </div>
                  <h3 className="font-bold text-base text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SOLUTIONS BY INSTITUTION TYPE */}
      <section id="solutions" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Tailored Educational Pathways
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Engineered for Every Educational Level
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSolutionTab("primary")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSolutionTab === "primary"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Pre-Primary & Primary CBC
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("secondary")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSolutionTab === "secondary"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Junior & Senior Secondary
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("tvet")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSolutionTab === "tvet"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            TVET & Technical Colleges
          </button>

          <button
            type="button"
            onClick={() => setActiveSolutionTab("multicampus")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSolutionTab === "multicampus"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            Multi-Campus Education Groups
          </button>
        </div>

        {/* Solution Details Panel */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-10">
          {activeSolutionTab === "primary" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  CBC Playgroup to Grade 6
                </span>
                <h3 className="text-2xl font-black text-white">
                  Holistic Competency-Based Curriculum & Formative Rubrics
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Support formative and summative CBC assessments aligned with national standards. Educators rate competencies directly, record termly comments, and generate beautiful, printable PDF report cards with automated performance analytics.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exceeding (EE), Meeting (ME), Approaching (AE), Below (BE) expectation rubrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Parent Portal with fee balances, daily roll-call, and exam transcripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant printable student ID cards with secure verification QR codes</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                  alt="Primary CBC Education"
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          )}

          {activeSolutionTab === "secondary" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                  Grade 7 to Grade 12
                </span>
                <h3 className="text-2xl font-black text-white">
                  Multi-Stream Scheduling, Gradebooks & Pre-Technical Tracks
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Seamlessly organize complex high school scheduling with automated timetable generation, multi-stream assessment tracking, pre-technical elective assignments, and mean-score rankings.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Automated weekly class timetable conflict resolver</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Subject teacher allocation & department performance benchmarking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Vote-head fee tracking for boarding, tuition, meals, and laboratory fees</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Secondary School"
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          )}

          {activeSolutionTab === "tvet" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  TVET, Polytechnics & Colleges
                </span>
                <h3 className="text-2xl font-black text-white">
                  Modular Curriculum, Semester Transcripts & Certificate Registries
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tailored for post-secondary technical institutes with support for KNEC / CDACC modular curriculum, termly module registrations, GPA calculations, course fee structures, and verifiable graduation certificates.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Diploma, Certificate & Artisan modular registration tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Official semester transcripts with grade distribution graphs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Graduation certificate generator with tamper-proof QR verification</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=80"
                  alt="TVET College"
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          )}

          {activeSolutionTab === "multicampus" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-400 border border-purple-800">
                  Multi-Campus Group Networks
                </span>
                <h3 className="text-2xl font-black text-white">
                  Centralized Multi-Branch Consolidation & Cross-Campus Operations
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unify all your school campuses and regional annexes under one central management command. Switch between constituent campuses instantly while maintaining branch-specific financial and academic books.
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Main campus executive dashboard with consolidated revenues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Branch-level staff allocation and student admissions routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Global audit trail tracking every staff and administrator action</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
                  alt="Multi-Campus Network"
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. SAAS PRICING & PLANS */}
      <section
        id="pricing-plans"
        className="py-16 sm:py-20 bg-slate-950 border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Transparent Cloud Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Predictable SaaS Tiers for Every Institution
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No hidden hardware costs. All plans include automated cloud backups, SSL encryption, and isolated multi-tenant databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {platformConfig.plans?.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className={`bg-slate-900 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl ${
                    plan.isPopular
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-slate-800"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600 text-white tracking-wider shadow-md">
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>
                    </div>

                    <div className="flex items-baseline gap-1 py-2">
                      <span className="text-sm font-bold text-slate-400 font-mono">
                        {plan.currency}
                      </span>
                      <span className="text-4xl font-black text-white font-mono">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">/{plan.billingCycle}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-750 text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Max Student Quota:</span>
                        <span className="font-bold text-white">{plan.maxStudents}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Branches Allowed:</span>
                        <span className="font-bold text-white">{plan.maxBranches}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Included Features:
                      </div>
                      {plan.features?.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={onOpenNewTenantModal}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                        plan.isPopular
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                    >
                      Provision Institution with {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS */}
      {platformConfig.testimonials && platformConfig.testimonials.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Trusted by Leading Academies
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              What Educational Leaders Say About Davetech
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformConfig.testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-lg"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-700/60">
                  {t.avatarUrl && (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600"
                    />
                  )}
                  <div>
                    <div className="font-bold text-xs text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {t.role} • {t.institution}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. ONBOARDING & CONTACT INQUIRIES FORM */}
      <section id="contact" className="py-16 sm:py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold uppercase">
              <Mail className="w-3.5 h-3.5" />
              <span>Institutional Onboarding & Sales</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready to Upgrade Your Institution to Davetech Cloud?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Schedule a personalized walkthrough for your board of governors, bursars, and head of academics. We configure your school&apos;s custom subdomain and import legacy student records for free.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/50 text-indigo-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Direct Support Phone</div>
                  <div className="font-semibold text-white">{platformConfig.supportPhone}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/50 text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Email Helpdesk</div>
                  <div className="font-semibold text-white">{platformConfig.supportEmail}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/50 text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Headquarters</div>
                  <div className="font-semibold text-white">{platformConfig.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {inquirySubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you. A Davetech cloud deployment specialist will contact your institution within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Request Institutional Demo</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.fullName}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, fullName: e.target.value })
                      }
                      placeholder="e.g. Dr. Jane Kamau"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, email: e.target.value })
                      }
                      placeholder="admin@school.ac.ke"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, phone: e.target.value })
                      }
                      placeholder="+254 700 000 000"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={inquiryForm.institutionName}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, institutionName: e.target.value })
                      }
                      placeholder="e.g. Apex High School"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Institution Level
                  </label>
                  <select
                    value={inquiryForm.institutionType}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, institutionType: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="school_primary">Pre-Primary & Primary CBC</option>
                    <option value="school_junior">Junior Secondary School (Gr 7-9)</option>
                    <option value="college_tvet">TVET / Technical Training College</option>
                    <option value="university">University / Multi-Campus Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Special Requirements or Questions
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, message: e.target.value })
                    }
                    placeholder="Tell us student population, number of branches, or custom modules needed..."
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingInquiry ? "Submitting Inquiry..." : "Submit Demo Request"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. PLATFORM FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={platformConfig.logo}
              alt=""
              className="w-8 h-8 rounded-lg object-cover bg-white p-1"
            />
            <div>
              <div className="font-bold text-slate-300">
                {platformConfig.brandName} Multi-Tenant Educational Operating System
              </div>
              <div className="text-[11px] text-slate-500">
                Powered by Google Cloud Firestore & Isolated SaaS Tenancies
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              type="button"
              onClick={() => setViewMode("platform")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Super Admin Hub
            </button>
            <button
              type="button"
              onClick={onOpenNewTenantModal}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Provision School
            </button>
            <a href="#institutions-directory" className="hover:text-white transition-colors">
              Directory
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
