import React, { useState } from "react";
import type { Tenant } from "../../types";
import { useTenant } from "../../context/TenantContext";
import {
  Globe,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Server,
  Network,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";

interface SubdomainInspectorModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
}

export const SubdomainInspectorModal: React.FC<SubdomainInspectorModalProps> = ({
  isOpen,
  tenant,
  onClose,
}) => {
  const { selectTenantBySubdomain, setViewMode } = useTenant();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !tenant) return null;

  const subdomain = (tenant.subdomain || tenant.code.toLowerCase()).replace(/[^a-z0-9-]/g, "");
  const productionHost = `https://${subdomain}.davetecherp.com`;
  const productionWebsiteHost = `https://${subdomain}.davetecherp.com/website`;

  // Local / Preview URLs
  const origin = window.location.origin;
  const previewErpUrl = `${origin}/?subdomain=${subdomain}&mode=erp`;
  const previewWebsiteUrl = `${origin}/?subdomain=${subdomain}&mode=website`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLaunchErp = () => {
    selectTenantBySubdomain(subdomain, "erp");
    onClose();
  };

  const handleLaunchWebsite = () => {
    selectTenantBySubdomain(subdomain, "website");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Subdomain & Routing Inspector
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tenant: {tenant.name} • <span className="font-mono text-blue-700">{subdomain}.davetecherp.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Subdomain Health Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Routing Diagnostic & DNS Status
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE & RESOLVABLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Subdomain Key</div>
                <div className="text-xs font-mono font-bold text-blue-600">{subdomain}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tenancy Isolation</div>
                <div className="text-xs font-mono font-bold text-emerald-600">{tenant.id}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                <div className="text-xs font-bold text-slate-900 uppercase">{tenant.status}</div>
              </div>
            </div>
          </div>

          {/* Quick Launch & Test Buttons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Immediate Tenant Testing & Simulation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleLaunchErp}
                className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-left shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-blue-100">Launch ERP Workspace</div>
                  <div className="text-sm font-bold mt-0.5">{tenant.code} Cloud Portal</div>
                  <div className="text-[11px] text-blue-200/80 mt-1 font-mono">mode=erp</div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleLaunchWebsite}
                className="p-4 bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-xl text-left shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-purple-100">Launch Public Website</div>
                  <div className="text-sm font-bold mt-0.5">{tenant.code} Branded Site</div>
                  <div className="text-[11px] text-purple-200/80 mt-1 font-mono">mode=website</div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Live URL Formats */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Accessible Endpoints & Shareable Links
            </h4>

            <div className="space-y-2.5">
              {/* Preview ERP Link */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">1. ERP Portal Preview Link (Local / Shared URL)</span>
                  <button
                    onClick={() => handleCopy(previewErpUrl, "preview_erp")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    {copiedKey === "preview_erp" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === "preview_erp" ? "Copied" : "Copy Link"}
                  </button>
                </div>
                <code className="block text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800 break-all">
                  {previewErpUrl}
                </code>
              </div>

              {/* Preview Website Link */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">2. Public Website Preview Link</span>
                  <button
                    onClick={() => handleCopy(previewWebsiteUrl, "preview_web")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    {copiedKey === "preview_web" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === "preview_web" ? "Copied" : "Copy Link"}
                  </button>
                </div>
                <code className="block text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800 break-all">
                  {previewWebsiteUrl}
                </code>
              </div>

              {/* Production Domain */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">3. Live Wildcard Domain (Production DNS)</span>
                  <button
                    onClick={() => handleCopy(productionHost, "prod_host")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    {copiedKey === "prod_host" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === "prod_host" ? "Copied" : "Copy Host"}
                  </button>
                </div>
                <code className="block text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800 break-all">
                  {productionHost}
                </code>
              </div>

              {tenant.customDomain && (
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900">4. Custom Vanity Domain</span>
                    <button
                      onClick={() => handleCopy(`https://${tenant.customDomain}`, "custom_dom")}
                      className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === "custom_dom" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === "custom_dom" ? "Copied" : "Copy Domain"}
                    </button>
                  </div>
                  <code className="block text-xs font-mono bg-white p-2 rounded-lg border border-purple-200 text-purple-900">
                    https://{tenant.customDomain}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Technical Explainer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              How Subdomain Routing Operates in DAVETECH ERP
            </h5>
            <p className="text-slate-600 leading-relaxed">
              When a client navigates to <code>https://{subdomain}.davetecherp.com</code> in production or opens <code>?subdomain={subdomain}</code> in preview, <code>TenantContext</code> intercepts the hostname prefix or URL query parameter, resolves the tenancy ID <code>{tenant.id}</code> in Firestore, and isolates fee registers, student profiles, and reports exclusively for <strong>{tenant.name}</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
