import React, { useState, useEffect, useRef } from "react";
import { useTenant } from "../../context/TenantContext";
import { saveTenant, uploadFileToStorage } from "../../services/firestoreService";
import { compressImageToDataUrl } from "../../utils/imageUtils";
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
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
  Check,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Lock,
  Network,
  Trash2,
} from "lucide-react";

export const SettingsManager: React.FC = () => {
  const { currentTenant, currentUser, setCurrentTenant } = useTenant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    motto: "",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160",
    email: "",
    phone: "",
    address: "",
    website: "",
    subdomain: "",
    customDomain: "",
    currency: "KES",
    primaryColor: "#4f46e5",
    subscriptionPlan: "enterprise",
  });

  // Sync formData whenever currentTenant updates or loads
  useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name || "",
        motto: currentTenant.motto || "",
        logo: currentTenant.logo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160",
        email: currentTenant.email || "",
        phone: currentTenant.phone || "",
        address: currentTenant.address || "",
        website: currentTenant.website || "",
        subdomain: currentTenant.subdomain || currentTenant.code?.toLowerCase() || "",
        customDomain: currentTenant.customDomain || "",
        currency: currentTenant.currency || "KES",
        primaryColor: currentTenant.primaryColor || "#4f46e5",
        subscriptionPlan: currentTenant.subscriptionPlan || "enterprise",
      });
    }
  }, [currentTenant?.id, currentTenant?.logo, currentTenant?.name]);

  const [copiedSubdomain, setCopiedSubdomain] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoSuccessMessage, setLogoSuccessMessage] = useState<string | null>(null);
  const [logoErrorMessage, setLogoErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const presetLogos = [
    { name: "Academic Crest 1", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200" },
    { name: "Modern Academy", url: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=200" },
    { name: "Tech Institute", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200" },
    { name: "Junior School", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200" },
    { name: "College Shield", url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200" },
  ];

  if (!currentTenant) return null;

  // Process file upload and save immediately
  const processAndApplyLogo = async (file: File) => {
    if (!file || !currentTenant) return;

    if (!file.type.startsWith("image/")) {
      setLogoErrorMessage("Please select a valid image file (PNG, JPG, SVG, WebP)");
      return;
    }

    setUploadingLogo(true);
    setLogoErrorMessage(null);
    setLogoSuccessMessage(null);

    try {
      // 1. Client-side compress to crisp web-ready image (<35KB)
      const compressedUrl = await compressImageToDataUrl(file, {
        maxWidth: 256,
        maxHeight: 256,
        quality: 0.85,
        mimeType: file.type.includes("png") ? "image/png" : "image/jpeg",
      });

      // 2. Upload to storage or use compressed fallback
      let finalUrl = compressedUrl;
      try {
        finalUrl = await uploadFileToStorage(currentTenant.id, "logos", file);
      } catch (storageErr) {
        console.warn("Storage upload fallback to compressed Data URL:", storageErr);
      }

      // 3. Update local form state
      setFormData((prev) => ({ ...prev, logo: finalUrl }));

      // 4. Auto-persist to Firestore immediately so user never loses their logo
      const updatedTenant = {
        ...currentTenant,
        logo: finalUrl,
        updatedAt: new Date().toISOString(),
      };
      await saveTenant(updatedTenant, {
        name: currentUser.name,
        email: currentUser.email,
      });
      setCurrentTenant(updatedTenant);

      setLogoSuccessMessage("Logo saved & synchronized successfully!");
      setTimeout(() => setLogoSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error("Logo upload error:", err);
      setLogoErrorMessage(err?.message || "Failed to upload logo. Please try another image.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndApplyLogo(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndApplyLogo(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleApplyPreset = async (presetUrl: string) => {
    if (!currentTenant || !presetUrl.trim()) return;
    setUploadingLogo(true);
    setLogoErrorMessage(null);
    try {
      setFormData((prev) => ({ ...prev, logo: presetUrl.trim() }));
      const updatedTenant = {
        ...currentTenant,
        logo: presetUrl.trim(),
        updatedAt: new Date().toISOString(),
      };
      await saveTenant(updatedTenant, {
        name: currentUser.name,
        email: currentUser.email,
      });
      setCurrentTenant(updatedTenant);
      setLogoSuccessMessage("Logo applied & saved successfully!");
      setTimeout(() => setLogoSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error("Apply logo error:", err);
      setLogoErrorMessage("Failed to save logo. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetLogo = async () => {
    const defaultLogo =
      currentTenant.type === "school_primary"
        ? "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200"
        : "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200";
    await handleApplyPreset(defaultLogo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedTenant = {
        ...currentTenant,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      await saveTenant(updatedTenant, { name: currentUser.name, email: currentUser.email });
      setCurrentTenant(updatedTenant);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      console.error("Save settings error:", err);
    } finally {
      setSaving(false);
    }
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
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Tenant organization settings and institutional branding saved successfully to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        {/* LOGO UPLOAD & BRANDING */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Institution Logo & Visual Identity</span>
            </h3>
            {logoSuccessMessage && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{logoSuccessMessage}</span>
              </span>
            )}
            {logoErrorMessage && (
              <span className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{logoErrorMessage}</span>
              </span>
            )}
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl border transition-all ${
              isDragOver
                ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-200"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Logo Preview */}
            <div className="relative group shrink-0 mx-auto sm:mx-0 flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={formData.logo}
                  alt="Institutional Logo"
                  className="w-28 h-28 rounded-2xl object-contain border-2 border-slate-200 shadow-md bg-white p-1.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160";
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
                  <span>{uploadingLogo ? "Processing..." : "Change Logo"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetLogo}
                disabled={uploadingLogo}
                className="text-[10px] text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                title="Reset to standard institution crest"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Logo</span>
              </button>
            </div>

            {/* Upload Controls */}
            <div className="space-y-3 flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-900">Upload Official Crest or School Badge</div>
                  <div className="text-[11px] text-slate-500">
                    Drag and drop or click to upload PNG, JPG, WebP, SVG. Auto-compressed & stored instantly in Firestore.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleLogoFileInputChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingLogo ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingLogo ? "Saving Logo..." : "Upload Logo Image"}</span>
                  </button>
                </div>
              </div>

              {/* Direct URL Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Or Paste Hosted Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(formData.logo)}
                    disabled={uploadingLogo || !formData.logo.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Apply & Save URL
                  </button>
                </div>
              </div>

              {/* Preset Sample Logos */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                <span className="text-[10px] text-slate-400 font-semibold shrink-0">Sample Crests:</span>
                {presetLogos.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset.url)}
                    className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 px-2.5 py-1 rounded-md text-slate-700 hover:text-indigo-600 font-medium whitespace-nowrap transition-colors cursor-pointer"
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

        {/* SUBDOMAIN & DOMAIN ROUTING SECTION */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-600" />
                <span>DAVETECH Platform Subdomain & Custom Domain</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Every tenant receives a high-performance, SSL-secured subdomain on DAVETECH ERP multi-tenant infrastructure.
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free Cloudflare SSL Active</span>
            </span>
          </div>

          {/* Subdomain Card Preview */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Assigned Tenant Live URL</span>
                </div>
                <div className="text-base sm:text-lg font-black text-white font-mono mt-0.5 tracking-tight flex items-center gap-1">
                  <span>https://</span>
                  <span className="text-emerald-400">
                    {(formData.subdomain || currentTenant.code || "tenant").toLowerCase()}
                  </span>
                  <span>.davetecherp.com</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `https://${(formData.subdomain || currentTenant.code || "tenant").toLowerCase()}.davetecherp.com`;
                    navigator.clipboard.writeText(fullUrl);
                    setCopiedSubdomain(true);
                    setTimeout(() => setCopiedSubdomain(false), 2500);
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSubdomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSubdomain ? "Copied!" : "Copy URL"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Tenant ERP: <b className="text-white">/app</b></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Public CMS Portal: <b className="text-white">/website</b></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Parent & Student: <b className="text-white">/portal</b></span>
              </div>
            </div>
          </div>

          {/* Subdomain Input Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Edit Tenant Subdomain Slug *
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2.5 rounded-l-lg text-xs font-mono text-slate-600">
                  https://
                </span>
                <input
                  type="text"
                  required
                  value={formData.subdomain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  placeholder="e.g. bitc, staustin, apex"
                  className="flex-1 p-2.5 border-y border-slate-300 text-xs font-mono font-bold text-indigo-700 bg-white focus:outline-none"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2.5 rounded-r-lg text-xs font-bold text-slate-700">
                  .davetecherp.com
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Only lowercase alphanumeric characters and hyphens.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Custom Domain (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. portal.breakthroughcollege.ac.ke"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value.toLowerCase() })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Point a DNS CNAME record from your custom domain to <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">custom.davetecherp.com</code>
              </p>
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
