import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Tenant } from "../../types";
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
} from "lucide-react";
import { deleteTenant } from "../../services/firestoreService";

interface PlatformAdminViewProps {
  onOpenNewTenantModal: () => void;
}

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({ onOpenNewTenantModal }) => {
  const { tenants, setCurrentTenant, setViewMode, currentUser, getTenantShareUrl, getTenantSubdomainUrl } = useTenant();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      (t.subdomain && t.subdomain.toLowerCase().includes(search.toLowerCase())) ||
      (t.customDomain && t.customDomain.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopySubdomain = (t: Tenant) => {
    const url = getTenantSubdomainUrl(t);
    navigator.clipboard.writeText(url);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (tenantId: string, tenantName: string) => {
    if (confirm(`Are you sure you want to delete tenant "${tenantName}"? This action is logged.`)) {
      await deleteTenant(tenantId, { name: currentUser.name });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Super Admin Portal (DAVETECH)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Multi-Tenant Organization Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision, monitor, and configure all school, college, and enterprise tenant instances on Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewTenantModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Tenant</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tenant Organizations
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tenants.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Active Cloud Tenancies
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cloud Database Engine
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">Google Cloud Firestore</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              Isolated sub-collections & RBAC
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              System Architecture
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">SaaS Multi-Tenancy</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              Dedicated website & portal per tenant
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Registered Tenant Instances ({tenants.length})
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tenant name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Subdomain & Live URL</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status & Plan</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.map((t) => {
                const sub = (t.subdomain || t.code || "tenant").toLowerCase();
                const subUrl = `https://${sub}.davetecherp.com`;
                const isCopied = copiedId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.logo}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{t.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ID: <span className="text-indigo-600 font-semibold">{t.code}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-700 font-bold bg-indigo-50/70 border border-indigo-200 px-2 py-1 rounded-lg w-fit">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>{sub}.davetecherp.com</span>
                          <button
                            type="button"
                            onClick={() => handleCopySubdomain(t)}
                            className="ml-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                            title="Copy Subdomain URL"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {t.customDomain && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>{t.customDomain}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold capitalize">
                        {t.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-900 text-[11px] uppercase">
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTenant(t);
                            setViewMode("erp");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Enter ERP
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTenant(t);
                            setViewMode("website");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Public Site
                        </button>
                        {tenants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id, t.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
  );
};
