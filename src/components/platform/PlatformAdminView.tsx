import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Tenant } from "../../types";
import { PlatformSettingsTab } from "./PlatformSettingsTab";
import { WebsiteCmsEditor } from "./WebsiteCmsEditor";
import { EditTenantModal } from "../tenants/EditTenantModal";
import { TenantCredentialsModal } from "../tenants/TenantCredentialsModal";
import { SubdomainInspectorModal } from "../tenants/SubdomainInspectorModal";
import { DeleteTenantModal } from "../tenants/DeleteTenantModal";
import {
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Database,
  CheckCircle2,
  CreditCard,
  Search,
  Copy,
  Check,
  Globe,
  Lock,
  Network,
  Sparkles,
  Settings,
  BarChart3,
  Server,
  Cpu,
  ArrowRight,
  Zap,
  Sliders,
  Palette,
  Edit,
  KeyRound,
  PauseCircle,
  PlayCircle,
  Filter,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface PlatformAdminViewProps {
  onOpenNewTenantModal: () => void;
}

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({
  onOpenNewTenantModal,
}) => {
  const {
    tenants,
    currentTenant,
    setCurrentTenant,
    setViewMode,
    currentUser,
    platformConfig,
    getTenantSubdomainUrl,
    editTenantAction,
    deleteTenantAction,
    suspendTenantAction,
    activateTenantAction,
  } = useTenant();

  const [activePlatformTab, setActivePlatformTab] = useState<
    "tenants" | "website_cms" | "settings" | "plans" | "health"
  >("tenants");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [credentialsTenant, setCredentialsTenant] = useState<Tenant | null>(null);
  const [inspectorTenant, setInspectorTenant] = useState<Tenant | null>(null);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      (t.subdomain && t.subdomain.toLowerCase().includes(search.toLowerCase())) ||
      (t.customDomain && t.customDomain.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopySubdomain = (t: Tenant) => {
    const url = getTenantSubdomainUrl(t);
    navigator.clipboard.writeText(url);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (tenant: Tenant) => {
    if (tenant.status === "suspended") {
      await activateTenantAction(tenant.id);
    } else {
      await suspendTenantAction(tenant.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={platformConfig.logo}
            alt="Platform Logo"
            className="w-12 h-12 rounded-xl object-contain bg-white p-1.5 border border-slate-200 shadow-sm shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
            }}
          />
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Super Admin Hub • {platformConfig.brandName}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {platformConfig.name}
            </h1>
            <p className="text-xs text-slate-500">
              Provision, edit, suspend, inspect subdomains, and manage passwords for all institutional clients.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setViewMode("davetech_home")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Davetech Main Home</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewTenantModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Provision New Tenant
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {[
          { id: "tenants", label: `Tenants & Subdomains (${tenants.length})`, icon: Building2 },
          { id: "website_cms", label: "Marketing CMS & Branding", icon: Palette },
          { id: "settings", label: "Platform Core Settings", icon: Settings },
          { id: "plans", label: "Commercial SaaS Tiers", icon: CreditCard },
          { id: "health", label: "Infrastructure & Health", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePlatformTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePlatformTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      {activePlatformTab === "tenants" && (
        <div className="space-y-6">
          {/* Subdomain & Controls Quick Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Subdomain & Credentials Engine
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  cname.davetecherp.com
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Multi-Tenant Subdomain Routing & Administrator Password Management
              </h3>
              <p className="text-xs text-blue-200/80 max-w-2xl leading-relaxed">
                Click <strong>"Inspect Subdomain"</strong> to test isolated tenant routing, or <strong>"Passwords"</strong> to reset/modify login credentials and generate 1-click WhatsApp credentials dispatch cards.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (tenants.length > 0) setInspectorTenant(tenants[0]);
                }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-blue-300" />
                Inspect Subdomain Routing
              </button>
            </div>
          </div>

          {/* Tenants Table & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Registered Tenants ({filteredTenants.length})
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "all", label: "All" },
                    { id: "active", label: "Active" },
                    { id: "suspended", label: "Suspended" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setStatusFilter(filter.id as any)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        statusFilter === filter.id
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search tenant, code, subdomain..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Subdomain & DNS</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Management Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTenants.map((t) => {
                    const sub = (t.subdomain || t.code || "tenant").toLowerCase();
                    const isCopied = copiedId === t.id;
                    const isSuspended = t.status === "suspended";

                    return (
                      <tr
                        key={t.id}
                        className={`transition-colors ${
                          isSuspended ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50/70"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={t.logo}
                              alt=""
                              className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0 shadow-xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {t.name}
                                {isSuspended && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900 uppercase">
                                    Suspended
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Code: <span className="text-blue-600 font-semibold">{t.code}</span> • ID: {t.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 font-bold bg-blue-50/70 border border-blue-200 px-2 py-1 rounded-lg w-fit">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>{sub}.davetecherp.com</span>
                              <button
                                type="button"
                                onClick={() => handleCopySubdomain(t)}
                                className="ml-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                                title="Copy Subdomain URL"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setInspectorTenant(t)}
                              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Globe className="w-3 h-3" />
                              Inspect Subdomain & Routing →
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold capitalize">
                            {t.type.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                isSuspended ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            ></span>
                            <span
                              className={`font-bold text-[11px] uppercase ${
                                isSuspended ? "text-amber-800" : "text-emerald-800"
                              }`}
                            >
                              {t.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({t.subscriptionPlan})
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 text-xs">
                          <div>{t.email}</div>
                          <div className="text-[11px] text-slate-400">{t.phone}</div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Edit Tenant */}
                            <button
                              type="button"
                              onClick={() => setEditingTenant(t)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Edit Tenant Configuration"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Passwords & Logins */}
                            <button
                              type="button"
                              onClick={() => setCredentialsTenant(t)}
                              className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                              title="Manage Staff Passwords & Login Credentials"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Suspend / Reactivate */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(t)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSuspended
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                              title={isSuspended ? "Reactivate Tenant Account" : "Suspend Tenant Account"}
                            >
                              {isSuspended ? (
                                <PlayCircle className="w-3.5 h-3.5" />
                              ) : (
                                <PauseCircle className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Enter ERP */}
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentTenant(t);
                                setViewMode("erp");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors cursor-pointer"
                            >
                              ERP
                            </button>

                            {/* Public Site */}
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentTenant(t);
                                setViewMode("website");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
                            >
                              Site
                            </button>

                            {/* Delete Tenant */}
                            <button
                              type="button"
                              onClick={() => setTenantToDelete(t)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Tenant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activePlatformTab === "website_cms" && <WebsiteCmsEditor />}
      {activePlatformTab === "settings" && <PlatformSettingsTab />}
      {activePlatformTab === "plans" && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-blue-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Commercial SaaS Subscriptions</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Starter, Growth and Enterprise tier pricing plans tailored for Kenyan primary schools, secondary academies, and TVET colleges.
          </p>
        </div>
      )}
      {activePlatformTab === "health" && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Server className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Cloud Cluster & Subdomain Health</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Wildcard TLS certificate valid on *.davetecherp.com. Firestore latency &lt; 40ms.
          </p>
        </div>
      )}

      {/* Edit Tenant Modal */}
      <EditTenantModal
        isOpen={!!editingTenant}
        tenant={editingTenant}
        onClose={() => setEditingTenant(null)}
        onSave={async (updated) => {
          await editTenantAction(updated);
        }}
        onOpenCredentials={(t) => {
          setEditingTenant(null);
          setCredentialsTenant(t);
        }}
        onOpenInspector={(t) => {
          setEditingTenant(null);
          setInspectorTenant(t);
        }}
        onDeleteTenant={(t) => {
          setEditingTenant(null);
          setTenantToDelete(t);
        }}
      />

      {/* Tenant Passwords & Credentials Modal */}
      <TenantCredentialsModal
        isOpen={!!credentialsTenant}
        tenant={credentialsTenant}
        onClose={() => setCredentialsTenant(null)}
      />

      {/* Subdomain Inspector Modal */}
      <SubdomainInspectorModal
        isOpen={!!inspectorTenant}
        tenant={inspectorTenant}
        onClose={() => setInspectorTenant(null)}
      />

      {/* Delete Tenant Confirmation Modal */}
      <DeleteTenantModal
        isOpen={!!tenantToDelete}
        tenant={tenantToDelete}
        onClose={() => setTenantToDelete(null)}
        onConfirmDelete={async (tenantId) => {
          await deleteTenantAction(tenantId);
        }}
      />
    </div>
  );
};
