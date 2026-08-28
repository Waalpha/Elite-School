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
} from "lucide-react";

interface DavetechLoginScreenProps {
  onBackToPublicWebsite?: () => void;
}

export const DavetechLoginScreen: React.FC<DavetechLoginScreenProps> = ({
  onBackToPublicWebsite,
}) => {
  const { loginWithGoogle, platformConfig, setDirectUserSession, setViewMode } = useTenant();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBack = () => {
    if (onBackToPublicWebsite) {
      onBackToPublicWebsite();
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
      setSuccessMsg("Signed in successfully with Google. Entering DAVETECH Backend...");
      setTimeout(() => {
        setViewMode("platform");
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
      setSuccessMsg("Authenticated as Platform Super Admin. Entering Backend...");
      setTimeout(() => {
        setViewMode("platform");
        setLoading(false);
      }, 400);
    }, 400);
  };

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
            src={platformConfig.logo}
            alt={platformConfig.name}
            className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-white/10 shadow-md backdrop-blur-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
            }}
          />
          <div>
            <div className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>{platformConfig.brandName}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                Cloud OS
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Multi-Tenant Enterprise Portal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="back_to_public_website_header_btn"
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Back to Public Website</span>
            <span className="sm:hidden">Website</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Auth Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800/90 shadow-2xl rounded-2xl p-8 backdrop-blur-xl transition-all duration-300">
            {/* Header / Brand Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                DAVETECH Platform Login
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                Sign in with your Google account to access your multi-tenant workspace & admin backend
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </div>
            )}

            {/* Primary Google Login Button */}
            <div className="space-y-4">
              <button
                id="google_signin_button"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3.5 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg hover:shadow-indigo-500/10 hover:border-slate-300 border border-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google G Logo SVG */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Authorized Platform Owner
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button
                  id="direct_david_login_button"
                  type="button"
                  onClick={handleQuickDavidLogin}
                  disabled={loading}
                  className="w-full mt-1 flex items-center justify-between py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                      DM
                    </div>
                    <div className="text-left truncate">
                      <div className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        David Muchiri
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        davmuchiri48@gmail.com (Super Admin)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              </div>

              {/* Return to Public Website button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer py-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to DAVETECH Public Website</span>
                </button>
              </div>
            </div>

            {/* Security & Multi-tenant Info */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>256-bit Firebase Auth</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Multi-Tenant Engine</span>
                </span>
              </div>
              <p className="text-[11px] text-center text-slate-500 leading-relaxed">
                DAVETECH Cloud Platform guarantees strict role-based data isolation across all tenant institutions, colleges, and schools.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-900 pt-4">
          <div>
            &copy; {new Date().getFullYear()} DAVETECH Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Cloud ERP</span>
            <span>•</span>
            <span>POS Systems</span>
            <span>•</span>
            <span>Custom Software</span>
            <span>•</span>
            <span>School Portals</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
