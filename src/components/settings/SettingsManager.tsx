import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { saveTenant, uploadFileToStorage } from "../../services/firestoreService";
import {
  Building2,
  Save,
  CheckCircle2,
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  Sparkles,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

export const SettingsManager: React.FC = () => {
  const { currentTenant, currentUser, setCurrentTenant } = useTenant();
  const [formData, setFormData] = useState({
    name: currentTenant?.name || "",
    motto: currentTenant?.motto || "",
    logo: currentTenant?.logo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160",
    email: currentTenant?.email || "",
    phone: currentTenant?.phone || "",
    address: currentTenant?.address || "",
    website: currentTenant?.website || "",
    currency: currentTenant?.currency || "KES",
    primaryColor: currentTenant?.primaryColor || "#4f46e5",
    subscriptionPlan: currentTenant?.subscriptionPlan || "enterprise",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const presetLogos = [
    { name: "Academic Crest 1", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200" },
    { name: "Modern Academy", url: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=200" },
    { name: "Tech Institute", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200" },
    { name: "Junior School", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200" },
  ];

  if (!currentTenant) return null;

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTenant) return;

    setUploadingLogo(true);
    try {
      // First try uploadFileToStorage; if storage isn't initialized or permissions vary, fallback to base64 DataURL
      let finalUrl = "";
      try {
        finalUrl = await uploadFileToStorage(currentTenant.id, "logos", file);
      } catch (storageErr) {
        console.warn("Storage upload fallback to DataURL:", storageErr);
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setFormData((prev) => ({ ...prev, logo: finalUrl }));
    } catch (err) {
      console.error("Logo upload error:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updatedTenant = {
      ...currentTenant,
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    await saveTenant(updatedTenant, { name: currentUser.name, email: currentUser.email });
    setCurrentTenant(updatedTenant);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <span>Tenant Organization Settings & Branding</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure institutional logo, crest, branding colors, currency, and official contact metadata for {currentTenant.name}.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Tenant organization settings and institutional logo saved successfully to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        {/* LOGO UPLOAD & BRANDING */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Institution Logo & Visual Identity</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            {/* Logo Preview */}
            <div className="relative group shrink-0">
              <img
                src={formData.logo}
                alt="Institutional Logo"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
              />
              <label className="absolute inset-0 bg-slate-950/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Controls */}
            <div className="space-y-2 flex-1 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Upload Institution Crest / Logo</div>
                  <div className="text-[11px] text-slate-500">
                    Recommended dimensions: 400x400 PNG or JPG with transparent background.
                  </div>
                </div>

                <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingLogo ? "Uploading..." : "Upload Logo File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Direct URL Input */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Or Paste Direct Logo Image URL:
                </label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>

              {/* Preset Sample Logos */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                {presetLogos.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, logo: preset.url })}
                    className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 px-2 py-0.5 rounded text-slate-700 hover:text-indigo-600 font-medium whitespace-nowrap"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Institutional Details & Color Theme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-9 h-9 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency Code</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold"
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD ($ United States Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
                <option value="UGX">UGX (Ugandan Shilling)</option>
                <option value="TZS">TZS (Tanzanian Shilling)</option>
                <option value="GBP">GBP (£ British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subscription Tier</label>
              <input
                type="text"
                disabled
                value={formData.subscriptionPlan.toUpperCase()}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Official Contact & Campus Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving to Cloud..." : "Save Tenant Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
