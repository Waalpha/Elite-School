import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Branch } from "../../types";
import {
  subscribeToBranches,
  saveBranch,
} from "../../services/firestoreService";
import {
  GitBranch,
  Plus,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  X,
  Radio,
} from "lucide-react";

export const BranchManager: React.FC = () => {
  const { currentTenant, currentBranch, selectBranch, currentUser } = useTenant();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    isMain: false,
    status: "active",
  });

  useEffect(() => {
    if (!currentTenant) return;
    const unsub = subscribeToBranches(currentTenant.id, setBranches);
    return () => unsub();
  }, [currentTenant?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const id = formData.id || "br_" + Date.now();
    const payload: Branch = {
      id,
      tenantId: currentTenant.id,
      name: formData.name || "New Campus",
      code: formData.code || "BR-" + Math.floor(100 + Math.random() * 900),
      address: formData.address || "",
      phone: formData.phone || "",
      email: formData.email || "",
      isMain: formData.isMain || false,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await saveBranch(currentTenant.id, payload, { name: currentUser.name });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <span>Campuses & Multi-Branch Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage satellite campuses, physical locations, and branch-level data segmentation in Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({
              name: "",
              code: "CAMPUS-" + Math.floor(10 + Math.random() * 90),
              address: "",
              phone: "+254 700 000 000",
              email: `campus@${currentTenant?.code.toLowerCase()}.ac.ke`,
              isMain: false,
              status: "active",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch / Campus</span>
        </button>
      </div>

      {/* Grid of Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => {
          const isSelected = currentBranch?.id === b.id;
          return (
            <div
              key={b.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isSelected ? "border-indigo-600 ring-2 ring-indigo-600/10" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {b.code}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{b.name}</h3>
                  </div>
                  {b.isMain && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Main Campus
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.address || "Location on file"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Node
                </span>

                <button
                  type="button"
                  onClick={() => selectBranch(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  {isSelected ? "Active in Scope" : "Switch Scope"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Campus / Branch</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westlands Campus, Town Branch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="Street, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
