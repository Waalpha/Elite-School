import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import type { UserRole } from "../../types";
import { QRScannerModal } from "../common/QRScannerModal";
import {
  Building2,
  Globe,
  ShieldCheck,
  ChevronDown,
  User,
  MapPin,
  Sparkles,
  ExternalLink,
  Layers,
  Check,
  Plus,
  QrCode,
  Lock,
  Copy,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  onOpenNewTenantModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTenantModal }) => {
  const {
    tenants,
    currentTenant,
    setCurrentTenant,
    branches,
    currentBranch,
    setCurrentBranch,
    currentUser,
    setCurrentUserRole,
    viewMode,
    setViewMode,
    platformConfig,
    getTenantSubdomainUrl,
    logout,
  } = useTenant();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [copiedHeaderSubdomain, setCopiedHeaderSubdomain] = useState(false);

  const rolesList: { role: UserRole; label: string; badge: string }[] = [
    { role: "platform_super_admin", label: "Platform Super Admin (DAVETECH)", badge: "Platform" },
    { role: "tenant_admin", label: "Tenant Administrator", badge: "Admin" },
    { role: "teacher", label: "Senior Educator / Class Teacher", badge: "Academics" },
    { role: "accountant", label: "Bursar / Finance Officer", badge: "Finance" },
    { role: "parent", label: "Parent / Guardian Portal", badge: "Portal" },
    { role: "student", label: "Student Portal", badge: "Portal" },
  ];

  return (
    <header id="davetech_main_header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Active Tenant */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode("davetech_home")}
              className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
              title="Go to Davetech Main Page"
            >
              <img
                src={platformConfig.logo}
                alt={platformConfig.name}
                className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 p-1 shadow-xs group-hover:border-indigo-500 transition-colors"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
                }}
              />
              <div className="hidden sm:block">
                <div className="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase flex items-center gap-1">
                  <span>{platformConfig.brandName}</span>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                    Cloud OS
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">
                  {platformConfig.name}
                </div>
              </div>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            {/* Current Tenant Selector */}
            <div className="relative">
              <button
                id="tenant_selector_button"
                type="button"
                onClick={() => {
                  setTenantDropdownOpen(!tenantDropdownOpen);
                  setBranchDropdownOpen(false);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left max-w-[280px] sm:max-w-xs"
              >
                {currentTenant?.logo ? (
                  <img
                    src={currentTenant.logo}
                    alt={currentTenant.name}
                    className="w-6 h-6 rounded-md object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentTenant?.name || "Select Tenant Organization"}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-slate-700 uppercase">
                      {currentTenant?.code || "TENANT"}
                    </span>
                    <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                      {(currentTenant?.subdomain || currentTenant?.code || "app").toLowerCase()}.davetecherp.com
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </button>

              {tenantDropdownOpen && (
                <div
                  id="tenant_dropdown_menu"
                  className="absolute left-0 mt-2 w-96 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>TENANT ORGANIZATIONS & SUBDOMAINS</span>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                      {tenants.length} active
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
                    {tenants.map((t) => {
                      const isSelected = currentTenant?.id === t.id;
                      const sub = (t.subdomain || t.code || "tenant").toLowerCase();
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setCurrentTenant(t);
                            setTenantDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 text-left flex items-center gap-3 transition-colors ${
                            isSelected ? "bg-indigo-50/90 text-indigo-950" : "hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <img
                            src={t.logo}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">{t.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-slate-700">{t.code}</span>
                              <span>•</span>
                              <span className="font-mono text-indigo-600 font-bold">
                                {sub}.davetecherp.com
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {onOpenNewTenantModal && (
                    <div className="pt-1 border-t border-slate-100 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTenantDropdownOpen(false);
                          onOpenNewTenantModal();
                        }}
                        className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Provision New Tenant Organization
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Active Branch (if multiple exist) */}
            {branches.length > 0 && viewMode === "erp" && (
              <div className="relative hidden md:block">
                <button
                  id="branch_selector_button"
                  type="button"
                  onClick={() => {
                    setBranchDropdownOpen(!branchDropdownOpen);
                    setTenantDropdownOpen(false);
                    setRoleDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="max-w-[130px] truncate">
                    {currentBranch?.name || "All Branches"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {branchDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                    <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase">
                      Campus / Branch
                    </div>
                    <div className="py-1">
                      {branches.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setCurrentBranch(b);
                            setBranchDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between ${
                            currentBranch?.id === b.id ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div>
                            <div>{b.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{b.address}</div>
                          </div>
                          {b.isMain && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold">
                              Main
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation & View Switcher */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                id="view_davetech_home_button"
                type="button"
                onClick={() => setViewMode("davetech_home")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "davetech_home"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="DAVETECH Public Website & Solutions Catalog"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Public Solutions</span>
                <span className="sm:hidden">Portal</span>
              </button>

              <button
                id="view_erp_button"
                type="button"
                onClick={() => setViewMode("erp")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "erp"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="School ERP Backend System"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">School ERP Backend</span>
                <span className="sm:hidden">ERP</span>
              </button>

              <button
                id="view_website_button"
                type="button"
                onClick={() => setViewMode("website")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "website"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="School Public Website"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">School Website</span>
                <span className="sm:hidden">Web</span>
              </button>

              <button
                id="view_platform_button"
                type="button"
                onClick={() => setViewMode("platform")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "platform"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Platform Super Admin"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Super Admin</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>

            {/* Scan QR Code Quick Button */}
            <button
              type="button"
              id="header_qr_scanner_btn"
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-xs transition-colors shrink-0"
              title="Scan QR Code / Verify ID & Fees"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative hidden lg:block">
              <button
                id="role_simulator_button"
                type="button"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setUserMenuOpen(false);
                  setTenantDropdownOpen(false);
                  setBranchDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-900">Role:</span>
                <span className="text-indigo-600 font-bold max-w-[120px] truncate">
                  {currentUser.role.replace(/_/g, " ")}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-xs font-bold text-slate-500 border-b border-slate-100">
                    SIMULATE USER ROLE (RBAC)
                  </div>
                  <div className="py-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => {
                          setCurrentUserRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                          currentUser.role === r.role
                            ? "bg-indigo-50 text-indigo-700 font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <div>{r.label}</div>
                          <div className="text-[10px] text-slate-400">{r.badge}</div>
                        </div>
                        {currentUser.role === r.role && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated Google Account Profile & Sign Out */}
            <div className="relative">
              <button
                id="user_profile_menu_button"
                type="button"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setRoleDropdownOpen(false);
                  setTenantDropdownOpen(false);
                  setBranchDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs"
                title={`Signed in as ${currentUser.email}`}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "D"}
                  </div>
                )}
                <div className="hidden sm:block text-left max-w-[110px] truncate">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-indigo-600 font-mono font-medium truncate mt-0.5">
                      {currentUser.email}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase">
                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                      <span>{currentUser.role.replace(/_/g, " ")}</span>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      id="sign_out_button"
                      type="button"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out of DAVETECH</span>
                      </span>
                      <span className="text-[10px] text-rose-400 font-normal">Exit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </header>
  );
};
