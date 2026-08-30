import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  Globe,
  Home,
  UserCheck,
  School,
  GraduationCap,
  Briefcase,
  BookOpen,
} from "lucide-react";
import type { UserRole } from "../../types";

interface DavetechLoginScreenProps {
  onBackToPublicWebsite?: () => void;
}

export const DavetechLoginScreen: React.FC<DavetechLoginScreenProps> = ({
  onBackToPublicWebsite,
}) => {
  const {
    currentTenant,
    loginWithGoogle,
    platformConfig,
    setDirectUserSession,
    setViewMode,
    selectTenantBySubdomain,
  } = useTenant();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loginTab, setLoginTab] = useState<"tenant" | "platform">(currentTenant ? "tenant" : "platform");

  const handleBack = () => {
    if (onBackToPublicWebsite) {
      onBackToPublicWebsite();
    } else if (currentTenant) {
      setViewMode("website");
    } else {
      setViewMode("davetech_home");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg("Signed in successfully with Google. Entering DAVETECH Workspace...");
      setTimeout(() => {
        if (currentTenant) {
          setViewMode("erp");
        } else {
          setViewMode("platform");
        }
      }, 500);
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please click below to try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups or use instant authentication below.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Google authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTenantRoleLogin = (role: UserRole, name: string, email: string) => {
    if (!currentTenant) return;
    setLoading(true);
    setSuccessMsg(`Signing in as ${name} (${role.replace("_", " ")})...`);
    setTimeout(() => {
      setDirectUserSession({
        id: `usr_${role}_${currentTenant.id}`,
        name,
        email,
        role,
        avatarUrl: undefined,
      });
      setSuccessMsg(`Authenticated to ${currentTenant.name}. Launching ERP portal...`);
      setTimeout(() => {
        setViewMode("erp");
        setLoading(false);
      }, 400);
    }, 400);
  };

  const handleQuickDavidLogin = () => {
    setLoading(true);
    setSuccessMsg("Authenticating David Muchiri (davmuchiri48@gmail.com)...");
    setTimeout(() => {
      setDirectUserSession({
        id: "usr_davetech_super_admin",
        name: "David Muchiri",
        email: "davmuchiri48@gmail.com",
        role: "platform_super_admin",
      });
      setSuccessMsg("Authenticated as Platform Super Admin. Entering Workspace...");
      setTimeout(() => {
        setViewMode(currentTenant ? "erp" : "platform");
        setLoading(false);
      }, 400);
    }, 400);
  };

  const subdomain = (currentTenant?.subdomain || currentTenant?.code || "tenant").toLowerCase();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Subtle geometric ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-3xl"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Top minimalistic header bar with Back to Website */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentTenant?.logo || platformConfig.logo}
            alt={currentTenant?.name || platformConfig.name}
            className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-white/10 shadow-md backdrop-blur-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
            }}
          />
          <div>
            <div className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>{currentTenant ? currentTenant.name : platformConfig.brandName}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                {currentTenant ? `${subdomain}.davetecherp.com` : "Cloud OS"}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {currentTenant ? currentTenant.motto || "School & Institutional Portal" : "Multi-Tenant Enterprise Portal"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentTenant && (
            <button
              type="button"
              onClick={() => setViewMode("website")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
          )}

          <button
            id="back_to_public_website_header_btn"
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Back to DAVETECH</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300">
            
            {/* If Current Tenant is active, show Tab Switcher */}
            {currentTenant && (
              <div className="flex items-center p-1 mb-6 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLoginTab("tenant")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    loginTab === "tenant"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>{currentTenant.code} Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginTab("platform")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    loginTab === "platform"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </button>
              </div>
            )}

            {/* Header / Brand Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-3 shadow-inner">
                {currentTenant && loginTab === "tenant" ? (
                  <School className="w-7 h-7 text-indigo-400" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-indigo-400" />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentTenant && loginTab === "tenant"
                  ? `${currentTenant.name} Login`
                  : "DAVETECH Platform Login"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                {currentTenant && loginTab === "tenant"
                  ? `Access isolated institutional records for ${subdomain}.davetecherp.com`
                  : "Sign in with your Google account to access your multi-tenant workspace & admin backend"}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </div>
            )}

            {/* TENANT PORTAL QUICK ROLES (When tenant tab is active) */}
            {currentTenant && loginTab === "tenant" && (
              <div className="space-y-3 mb-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Role / Quick Demo Login
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTenantRoleLogin(
                        "tenant_admin",
                        `Dr. ${currentTenant.code} Principal`,
                        `principal@${subdomain}.davetecherp.com`
                      )
                    }
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-300">Principal / Director</div>
                        <div className="text-[10px] text-slate-400">Full school admin</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform" />
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTenantRoleLogin(
                        "accountant",
                        "Finance Bursar",
                        `bursar@${subdomain}.davetecherp.com`
                      )
                    }
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300">Bursar / Accounts</div>
                        <div className="text-[10px] text-slate-400">Fee registers & POS</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform" />
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTenantRoleLogin(
                        "teacher",
                        "Senior Teacher",
                        `teacher@${subdomain}.davetecherp.com`
                      )
                    }
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-300">Teacher / Lecturer</div>
                        <div className="text-[10px] text-slate-400">Attendance & CBC</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform" />
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTenantRoleLogin(
                        "student",
                        "Student Portal User",
                        `student@${subdomain}.davetecherp.com`
                      )
                    }
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300">Student / Parent</div>
                        <div className="text-[10px] text-slate-400">Fee statement & grades</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Google Login & Platform Owner options */}
            <div className="space-y-3.5">
              <button
                id="google_signin_button"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3.5 py-3 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-lg hover:shadow-indigo-500/10 hover:border-slate-300 border border-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google Account</span>
                  </>
                )}
              </button>

              {/* Direct Authorized Owner Instant Login */}
              <button
                id="direct_david_login_button"
                type="button"
                onClick={handleQuickDavidLogin}
                disabled={loading}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                    DM
                  </div>
                  <div className="text-left truncate">
                    <div className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      David Muchiri
                    </div>
                    <div className="text-[10px] text-indigo-300 font-medium truncate">
                      Platform Super Administrator (Executive Owner)
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            </div>

            {/* Security & Multi-tenant Info */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Isolated Tenancy</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-indigo-300">
                  {currentTenant ? `${subdomain}.davetecherp.com` : "davetecherp.com"}
                </span>
              </div>
              <p className="text-[10px] text-center text-slate-500 leading-relaxed">
                DAVETECH Multi-Tenant Cloud guarantees end-to-end role and tenant isolation across fee ledgers, exams, and attendance.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900 pt-3">
          <div>
            &copy; {new Date().getFullYear()} DAVETECH Multi-Tenant Cloud. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Subdomain Routing</span>
            <span>•</span>
            <span>Cloud ERP</span>
            <span>•</span>
            <span>CBC & TVET</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

