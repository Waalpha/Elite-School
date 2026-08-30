import React, { useState, useEffect } from "react";
import type { Tenant, TenantType } from "../../types";
import {
  Building2,
  X,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Palette,
  Shield,
  Layers,
  PauseCircle,
  PlayCircle,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

interface EditTenantModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSave: (updatedTenant: Tenant) => Promise<void>;
  onOpenCredentials?: (tenant: Tenant) => void;
  onOpenInspector?: (tenant: Tenant) => void;
  onDeleteTenant?: (tenant: Tenant) => void;
}

const MODULE_OPTIONS = [
  { id: "education", label: "Academics & Curriculum", desc: "Courses, subjects, terms & grading" },
  { id: "admissions", label: "Student Admissions", desc: "Enrollment & student profiles" },
  { id: "classes", label: "Classes & Streams", desc: "Grade levels, classes and rosters" },
  { id: "primary_cbc", label: "Primary CBC & Assessments", desc: "Competency-based rubric ratings" },
  { id: "junior_school", label: "Junior Secondary (JSS)", desc: "Grade 7-9 learning pathways" },
  { id: "fees", label: "Fee Management & Billing", desc: "Fee structures, invoices and receipts" },
  { id: "accounting", label: "Finance & Accounting", desc: "General ledger and expenses" },
  { id: "exams", label: "Examinations & Marks", desc: "Exams entry and mark calculation" },
  { id: "transcripts", label: "Transcripts & Reports", desc: "Termly progress report cards" },
  { id: "attendance", label: "Daily Attendance", desc: "Biometric and roster roll call" },
  { id: "timetable", label: "Timetable & Scheduling", desc: "Lesson periods and hall allocation" },
  { id: "hr", label: "Staff & Human Resources", desc: "Teachers, payroll and leaves" },
  { id: "certificates", label: "Certificate Issuance", desc: "Completion & graduation certs" },
  { id: "website", label: "School Public Website", desc: "Custom branded web presence" },
  { id: "parent_portal", label: "Parent & Guardian Portal", desc: "SMS/email alerts and progress" },
  { id: "branches", label: "Multi-Campus Branches", desc: "Manage satellite campuses" },
];

export const EditTenantModal: React.FC<EditTenantModalProps> = ({
  isOpen,
  tenant,
  onClose,
  onSave,
  onOpenCredentials,
  onOpenInspector,
  onDeleteTenant,
}) => {
  const [formData, setFormData] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "modules" | "branding" | "subdomain">("general");

  useEffect(() => {
    if (tenant) {
      setFormData({ ...tenant });
      setSuccessMessage(null);
    }
  }, [tenant]);

  if (!isOpen || !formData) return null;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubdomainChange = (val: string) => {
    const clean = slugify(val);
    setFormData((prev) => (prev ? { ...prev, subdomain: clean } : null));
  };

  const handleModuleToggle = (modId: string) => {
    if (!formData) return;
    const current = formData.enabledModules || [];
    const updated = current.includes(modId)
      ? current.filter((m) => m !== modId)
      : [...current, modId];
    setFormData({ ...formData, enabledModules: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setSuccessMessage("Tenant configuration updated successfully.");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = () => {
    if (!formData) return;
    const newStatus = formData.status === "suspended" ? "active" : "suspended";
    setFormData({ ...formData, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: formData.primaryColor || "#4f46e5" }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Edit Tenant: {formData.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    formData.status === "active"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : formData.status === "suspended"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                ID: {formData.id} • Code: {formData.code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCredentials && (
              <button
                type="button"
                onClick={() => onOpenCredentials(formData)}
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Manage Staff & Administrator Passwords"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Passwords & Logins
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 gap-2 pt-2">
          {[
            { id: "general", label: "General & Contacts", icon: Building2 },
            { id: "subdomain", label: "Subdomain & DNS", icon: Globe },
            { id: "branding", label: "Branding & Styling", icon: Palette },
            { id: "modules", label: `Modules (${formData.enabledModules?.length || 0})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TenantType })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="school_primary">Pre-Primary & Primary (CBC Playgroup - Grade 6)</option>
                    <option value="school_secondary">Junior & Senior Secondary (Grade 7 - 12)</option>
                    <option value="college_tvet">College / TVET / Vocational Institute</option>
                    <option value="university">University / Higher Education</option>
                    <option value="retail_pos">Retail & POS Enterprise</option>
                    <option value="custom_business">Custom Enterprise Client</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subscriptionPlan: e.target.value as "starter" | "growth" | "enterprise",
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="starter">Starter Plan</option>
                    <option value="growth">Growth Business Plan</option>
                    <option value="enterprise">Enterprise Flagship Plan (Full Suite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Contact *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Physical Address / Campus Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Motto / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.motto || ""}
                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Suspend Panel */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Tenancy Account Status</h4>
                  <p className="text-xs text-slate-500">
                    {formData.status === "active"
                      ? "This tenant portal is currently ACTIVE and accessible by staff and learners."
                      : "This tenant portal is currently SUSPENDED. Access to ERP modules is temporarily restricted."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                    formData.status === "suspended"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                  }`}
                >
                  {formData.status === "suspended" ? (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Reactivate Tenancy
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-4 h-4" />
                      Suspend Tenancy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "subdomain" && (
            <div className="space-y-5">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">DAVETECH Subdomain & Domain Architecture</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Every tenant receives an isolated subdomain (e.g., <code>https://{formData.subdomain || "tenant"}.davetecherp.com</code>). 
                      In local / preview mode, you can also access it instantly via <code>?subdomain={formData.subdomain || "tenant"}</code>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subdomain Prefix *
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      type="text"
                      required
                      value={formData.subdomain || ""}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      placeholder="e.g. staustin"
                      className="w-full px-3.5 py-2.5 text-sm focus:outline-none font-mono"
                    />
                    <span className="bg-slate-100 text-slate-500 text-xs px-3 flex items-center border-l border-slate-200 font-mono">
                      .davetecherp.com
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Vanity Domain (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.customDomain || ""}
                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    placeholder="e.g. portal.staustin.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Point CNAME record to <code>cname.davetecherp.com</code>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Subdomain URLs for this Tenant
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Production Production Host:</span>{" "}
                      <code className="text-blue-600 font-mono">https://{formData.subdomain || "tenant"}.davetecherp.com</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">In-App Preview Simulator URL:</span>{" "}
                      <code className="text-purple-600 font-mono">?subdomain={formData.subdomain || "tenant"}&mode=erp</code>
                    </div>
                  </div>
                </div>

                {onOpenInspector && (
                  <button
                    type="button"
                    onClick={() => onOpenInspector(formData)}
                    className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Open Live Subdomain Inspector & DNS Tester →
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor || "#4f46e5"}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || "#4f46e5"}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Default Currency
                  </label>
                  <select
                    value={formData.currency || "KES"}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="KES">KES - Kenyan Shillings</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="TZS">TZS - Tanzanian Shilling</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Logo Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.logo ? (
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.logo || ""}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "modules" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Provisioned ERP Modules</h4>
                  <p className="text-xs text-slate-500">
                    Enable or disable specific features based on the institution’s subscription.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        enabledModules: MODULE_OPTIONS.map((m) => m.id),
                      })
                    }
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, enabledModules: ["education", "admissions", "fees"] })}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Reset to Core
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {MODULE_OPTIONS.map((mod) => {
                  const isChecked = formData.enabledModules?.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-blue-50/50 border-blue-200 text-blue-900 shadow-sm"
                          : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleModuleToggle(mod.id)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div>
                        <div className="text-xs font-bold">{mod.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{mod.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              {onDeleteTenant && tenant && (
                <button
                  type="button"
                  onClick={() => onDeleteTenant(tenant)}
                  className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Permanently remove this tenant"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Institution
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving Changes..." : "Save Tenant Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
