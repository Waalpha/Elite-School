import React, { useState, useRef, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import { compressImageToDataUrl } from "../../utils/imageUtils";
import {
  ShieldCheck,
  Building2,
  Upload,
  Camera,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Save,
  Globe,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Palette,
  Layers,
  Zap,
} from "lucide-react";

export const PlatformSettingsTab: React.FC = () => {
  const { platformConfig, updatePlatformConfig } = useTenant();

  const [formData, setFormData] = useState({
    name: platformConfig.name || "Davetech Multi-Tenant Cloud",
    brandName: platformConfig.brandName || "DAVETECH",
    tagline:
      platformConfig.tagline ||
      "Enterprise Multi-Tenant Educational Operating System & School ERP",
    logo:
      platformConfig.logo ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200",
    heroTitle:
      platformConfig.heroTitle ||
      "The Intelligent Multi-Tenant Operating System for Modern Education",
    heroSubtitle:
      platformConfig.heroSubtitle ||
      "Empower primary schools, high schools, TVET colleges, and universities with autonomous cloud ERP, automated CBC & modular grading, isolated multi-tenant subdomains, and instant branded websites.",
    announcementBanner:
      platformConfig.announcementBanner ||
      "🚀 Davetech Cloud v4.2 Release: Live Automated CBC Assessments, Real-Time Fee Gateways & Multi-Campus Syncing Now Live!",
    supportEmail: platformConfig.supportEmail || "support@davetech.co.ke",
    supportPhone: platformConfig.supportPhone || "+254 700 000 123",
    address:
      platformConfig.address ||
      "Davetech Innovation Tower, Upper Hill, Nairobi, Kenya",
    websiteUrl: platformConfig.websiteUrl || "https://davetecherp.com",
    primaryColor: platformConfig.primaryColor || "#4f46e5",
    accentColor: platformConfig.accentColor || "#06b6d4",
    enablePublicRegistrations: platformConfig.enablePublicRegistrations ?? true,
    enableMultiCampus: platformConfig.enableMultiCampus ?? true,
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when platformConfig updates
  useEffect(() => {
    if (platformConfig) {
      setFormData({
        name: platformConfig.name || "Davetech Multi-Tenant Cloud",
        brandName: platformConfig.brandName || "DAVETECH",
        tagline:
          platformConfig.tagline ||
          "Enterprise Multi-Tenant Educational Operating System & School ERP",
        logo:
          platformConfig.logo ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200",
        heroTitle:
          platformConfig.heroTitle ||
          "The Intelligent Multi-Tenant Operating System for Modern Education",
        heroSubtitle:
          platformConfig.heroSubtitle ||
          "Empower primary schools, high schools, TVET colleges, and universities with autonomous cloud ERP, automated CBC & modular grading, isolated multi-tenant subdomains, and instant branded websites.",
        announcementBanner:
          platformConfig.announcementBanner ||
          "🚀 Davetech Cloud v4.2 Release: Live Automated CBC Assessments, Real-Time Fee Gateways & Multi-Campus Syncing Now Live!",
        supportEmail: platformConfig.supportEmail || "support@davetech.co.ke",
        supportPhone: platformConfig.supportPhone || "+254 700 000 123",
        address:
          platformConfig.address ||
          "Davetech Innovation Tower, Upper Hill, Nairobi, Kenya",
        websiteUrl: platformConfig.websiteUrl || "https://davetecherp.com",
        primaryColor: platformConfig.primaryColor || "#4f46e5",
        accentColor: platformConfig.accentColor || "#06b6d4",
        enablePublicRegistrations: platformConfig.enablePublicRegistrations ?? true,
        enableMultiCampus: platformConfig.enableMultiCampus ?? true,
      });
    }
  }, [platformConfig]);

  const handleLogoFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, SVG, WebP).");
      return;
    }

    try {
      setUploadingLogo(true);
      const optimizedDataUrl = await compressImageToDataUrl(file, {
        maxWidth: 280,
        maxHeight: 280,
        quality: 0.9,
      });
      setFormData((prev) => ({ ...prev, logo: optimizedDataUrl }));
      await updatePlatformConfig({ logo: optimizedDataUrl });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Logo processing error:", err);
      alert("Failed to process image. Please try another file.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleLogoFileProcess(file);
    }
  };

  const handleResetLogo = async () => {
    const defaultLogo =
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80";
    setFormData((prev) => ({ ...prev, logo: defaultLogo }));
    await updatePlatformConfig({ logo: defaultLogo });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const logoPresets = [
    {
      name: "Davetech Tech Shield",
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Global Cyber Core",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "EduCloud Emblem",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80",
    },
    {
      name: "Modern Academy Crest",
      url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const handleApplyPreset = async (url: string) => {
    setFormData((prev) => ({ ...prev, logo: url }));
    await updatePlatformConfig({ logo: url });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updatePlatformConfig(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Save platform settings error:", err);
      alert("Failed to save platform settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Top Banner Alert */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Davetech platform configuration, branding, and logo updated and saved in Firestore!
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">Live Across System</span>
        </div>
      )}

      {/* 1. DAVETECH PLATFORM LOGO & BRAND ASSETS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Davetech Platform Official Logo & Branding
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Master Cloud Logo
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border-2 border-dashed transition-all ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50/50"
              : "border-slate-200 bg-slate-50/60"
          }`}
        >
          {/* Logo Visual Box */}
          <div className="relative group shrink-0 flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={formData.logo}
                alt="Davetech Platform Logo"
                className="w-24 h-24 rounded-2xl object-contain bg-white p-2 border-2 border-slate-200 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="absolute inset-0 bg-slate-950/60 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px] font-bold"
              >
                {uploadingLogo ? (
                  <RefreshCw className="w-5 h-5 animate-spin mb-1" />
                ) : (
                  <Camera className="w-5 h-5 mb-1" />
                )}
                <span>{uploadingLogo ? "Saving..." : "Change Logo"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetLogo}
              disabled={uploadingLogo}
              className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Upload Davetech Master Logo Image
                </div>
                <div className="text-[11px] text-slate-500">
                  PNG, JPG, WebP, SVG. Stored in Cloud Firestore & displayed across all portals.
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {uploadingLogo ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingLogo ? "Optimizing & Saving..." : "Select Logo File"}</span>
                </button>
              </div>
            </div>

            {/* Direct URL Input */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Or Apply Logo Direct Image URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/davetech-logo.png"
                  className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updatePlatformConfig({ logo: formData.logo })}
                  disabled={uploadingLogo || !formData.logo.trim()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Apply & Save
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400">Presets:</span>
              {logoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset.url)}
                  className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 px-2 py-0.5 rounded-md text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PLATFORM IDENTITY & HEADLINE COPY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Davetech Platform Name, Tagline & Copy
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Platform Brand Short Name *
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Platform Full Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Platform Tagline / Slogan
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Top Announcement Banner Bar (Optional)
          </label>
          <input
            type="text"
            value={formData.announcementBanner}
            onChange={(e) =>
              setFormData({ ...formData, announcementBanner: e.target.value })
            }
            placeholder="e.g. 🚀 Davetech v4.2 Release: Live Automated CBC Assessments..."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Main Homepage Hero Title
          </label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Main Homepage Hero Subtitle & Description
          </label>
          <textarea
            rows={3}
            value={formData.heroSubtitle}
            onChange={(e) =>
              setFormData({ ...formData, heroSubtitle: e.target.value })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>
      </div>

      {/* 3. CONTACT & PLATFORM HEADQUARTERS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Mail className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Davetech Platform Contact & Corporate Info
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Support Email
            </label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Helpdesk Phone Number
            </label>
            <input
              type="tel"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Headquarters Physical Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Platform Domain URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. FEATURE FLAGS & COLORS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Platform Brand Colors & Feature Flags
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Platform Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enablePublicRegistrations}
              onChange={(e) =>
                setFormData({ ...formData, enablePublicRegistrations: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Allow Online School Onboarding
              </div>
              <div className="text-[11px] text-slate-500">
                Shows demo & provisioning CTA on main Davetech homepage.
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enableMultiCampus}
              onChange={(e) =>
                setFormData({ ...formData, enableMultiCampus: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Enable Multi-Campus Engine
              </div>
              <div className="text-[11px] text-slate-500">
                Permits institutions to create and manage constituent branches.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={savingSettings || uploadingLogo}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {savingSettings ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savingSettings ? "Saving Changes..." : "Save Davetech Platform Settings"}</span>
        </button>
      </div>
    </form>
  );
};
