import React, { useState } from "react";
import type { Tenant } from "../../types";
import {
  AlertTriangle,
  Trash2,
  X,
  Building2,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface DeleteTenantModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onConfirmDelete: (tenantId: string) => Promise<void>;
}

export const DeleteTenantModal: React.FC<DeleteTenantModalProps> = ({
  isOpen,
  tenant,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tenant) return null;

  const expectedCode = (tenant.code || "DELETE").toUpperCase();
  const isMatch = confirmationCode.trim().toUpperCase() === expectedCode;

  const handleDelete = async () => {
    if (!isMatch) {
      setError(`Please type the tenant code "${expectedCode}" to confirm.`);
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirmDelete(tenant.id);
      setIsDeleting(false);
      setConfirmationCode("");
      onClose();
    } catch (err: any) {
      console.error("Delete tenant failed:", err);
      setError(err?.message || "Failed to delete tenant. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 w-full max-w-lg overflow-hidden flex flex-col my-auto">
        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-5 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-200" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
                Permanent Action
              </span>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Delete Institutional Tenancy?
            </h3>
            <p className="text-xs text-rose-100/90 leading-relaxed mt-0.5">
              This will permanently delete <strong>{tenant.name}</strong> from the multi-tenant database.
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600">
          {/* Target Tenant Overview Card */}
          <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl flex items-center gap-3">
            <img
              src={tenant.logo}
              alt=""
              className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-1 shrink-0 shadow-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-sm truncate">
                {tenant.name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                <span>Code: <strong className="text-slate-800">{tenant.code}</strong></span>
                <span>•</span>
                <span>Subdomain: <strong className="text-rose-700">{tenant.subdomain || tenant.code}.davetecherp.com</strong></span>
              </div>
            </div>
          </div>

          {/* Deletion Scope List */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Data that will be permanently destroyed:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pl-1">
              <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>All Student & Staff records</span>
              </li>
              <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Fee structures & receipts</span>
              </li>
              <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Academic CBC & TVET gradebooks</span>
              </li>
              <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Website CMS & Subdomain routing</span>
              </li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              Type <span className="font-mono px-1.5 py-0.5 bg-slate-100 rounded text-rose-700 font-black">{expectedCode}</span> below to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => {
                setConfirmationCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder={`Type ${expectedCode}`}
              disabled={isDeleting}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none uppercase"
            />
            {error && (
              <p className="text-[11px] font-semibold text-rose-600 animate-in fade-in">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel & Keep Tenant
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!isMatch || isDeleting}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Purging Tenant Data..." : "Permanently Delete Tenant"}
          </button>
        </div>
      </div>
    </div>
  );
};
