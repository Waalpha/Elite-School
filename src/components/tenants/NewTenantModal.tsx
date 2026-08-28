import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Tenant, TenantType } from "../../types";
import { saveTenant } from "../../services/firestoreService";
import { Building2, X, Plus, Sparkles, CheckCircle2 } from "lucide-react";

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTenantModal: React.FC<NewTenantModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentTenant } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    subdomain: string;
    customDomain: string;
    type: TenantType;
    email: string;
    phone: string;
    address: string;
    motto: string;
    primaryColor: string;
    currency: string;
  }>({
    name: "",
    code: "",
    subdomain: "",
    customDomain: "",
    type: "school_primary",
    email: "",
    phone: "+254 ",
    address: "",
    motto: "",
    primaryColor: "#4f46e5",
    currency: "KES",
  });

  if (!isOpen) return null;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const baseSubdomain = slugify(formData.subdomain || formData.code || formData.name || "tenant");
    const tenantId = baseSubdomain + "-" + Math.floor(100 + Math.random() * 900);
    
    const newTenant: Tenant = {
      id: tenantId,
      name: formData.name,
      code: formData.code.toUpperCase(),
      subdomain: baseSubdomain,
      customDomain: formData.customDomain ? formData.customDomain.trim().toLowerCase() : undefined,
      type: formData.type,
      logo: formData.type === "school_primary"
        ? "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200"
        : "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200",
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: `https://${baseSubdomain}.davetecherp.com`,
      country: "Kenya",
      status: "active",
      subscriptionPlan: "enterprise",
      currency: formData.currency,
      primaryColor: formData.primaryColor,
      motto: formData.motto || "Excellence in Education",
      enabledModules: [
        "education",
        "admissions",
        "classes",
        "fees",
        "exams",
        "attendance",
        "timetable",
        "hr",
        "certificates",
        "website",
        "reports",
        "branches",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveTenant(newTenant, { name: currentUser.name, email: currentUser.email });
    setIsSubmitting(false);
    setSuccess(true);
    setCurrentTenant(newTenant);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Provision New Tenant Organization</h3>
              <p className="text-[11px] text-slate-500">Add an independent school or college database instance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Tenant Provisioned!</h4>
            <p className="text-xs text-slate-500">Switching active organization scope...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Institution Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex High School, Nairobi Technical College"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = slugify(val);
                  setFormData({
                    ...formData,
                    name: val,
                    code: formData.code || val.split(" ").map((w) => w[0]).join("").substring(0, 5),
                    subdomain: formData.subdomain ? formData.subdomain : autoSlug,
                  });
                }}
                className="w-full p-2.5 rounded-lg border border-slate-200 font-semibold"
              />
            </div>

            {/* Subdomain Configuration Section */}
            <div className="bg-indigo-50/70 border border-indigo-200 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-indigo-950">
                  DAVETECH ERP Dedicated Subdomain *
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  SSL Secured
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-300 px-2.5 py-2 rounded-l-lg text-[11px] font-mono text-slate-600">
                  https://
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. apex-academy"
                  value={formData.subdomain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subdomain: slugify(e.target.value),
                    })
                  }
                  className="flex-1 p-2 border-y border-slate-300 text-xs font-mono font-bold text-indigo-700 bg-white focus:outline-none"
                />
                <span className="bg-indigo-100 border border-l-0 border-indigo-300 px-2.5 py-2 rounded-r-lg text-[11px] font-bold text-indigo-900">
                  .davetecherp.com
                </span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center justify-between">
                <span>Unique routing address for public website, staff ERP, and portals</span>
                <span className="font-mono text-indigo-700 font-semibold">
                  {slugify(formData.subdomain || formData.code || "tenant")}.davetecherp.com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Short Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APEX, NTC"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Institution Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TenantType })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                >
                  <option value="school_primary">Pre-Primary & Primary CBC (Grade 1-6)</option>
                  <option value="school_junior">Junior Secondary School (Grade 7-9)</option>
                  <option value="college_tvet">TVET / Technical College</option>
                  <option value="university">University / Higher Institution</option>
                  <option value="general_business">Commercial Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                placeholder="e.g. Strive for Excellence"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@school.ac.ke"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Physical Location</label>
                <input
                  type="text"
                  placeholder="Nairobi, Kenya"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Brand Theme Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-[11px] text-slate-600">{formData.primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? "Provisioning..." : "Provision Tenant"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
