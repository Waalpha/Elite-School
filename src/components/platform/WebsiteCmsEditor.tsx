import React, { useState, useRef, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import { compressImageToDataUrl } from "../../utils/imageUtils";
import type { HeroSlide, HeroVisualSettings } from "../../types";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Sliders,
  Eye,
  Save,
  CheckCircle2,
  Layers,
  Palette,
  RefreshCw,
  HelpCircle,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Globe,
} from "lucide-react";

export const WebsiteCmsEditor: React.FC = () => {
  const { platformConfig, updatePlatformConfig, setViewMode } = useTenant();

  // Default visual settings fallback
  const defaultVisual: HeroVisualSettings = {
    fontAlignment: "center",
    fontFamily: "sans",
    fontSize: "large",
    fontStyle: "bold",
    photoTransparency: 85,
    overlayOpacity: 75,
    overlayColor: "#020617",
    imageBlur: 0,
    imageBrightness: 100,
    imageFit: "cover",
    autoSlide: true,
    slideInterval: 6,
    activeSlideIndex: 0,
  };

  const [slides, setSlides] = useState<HeroSlide[]>(
    platformConfig.heroSlides && platformConfig.heroSlides.length > 0
      ? platformConfig.heroSlides
      : [
          {
            id: "slide_1",
            imageUrl:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
            title: "Enterprise Software & Cloud Platforms",
            subtitle: "Multi-tenant scalability for universities, schools, and modern businesses",
            caption: "Nairobi Engineering & Cloud Center",
          },
          {
            id: "slide_2",
            imageUrl:
              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
            title: "Autonomous School ERP & CBC Systems",
            subtitle: "Automated report cards, student profiles, and multi-campus synchronization",
            caption: "Smart Educational Cloud",
          },
          {
            id: "slide_3",
            imageUrl:
              "https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=1600&auto=format&fit=crop&q=80",
            title: "Retail POS & Barcode Inventory",
            subtitle: "Instant M-Pesa receipting, stock tracking, and multi-branch registers",
            caption: "Retail POS Terminal",
          },
        ]
  );

  const [visualSettings, setVisualSettings] = useState<HeroVisualSettings>({
    ...defaultVisual,
    ...(platformConfig.heroVisualSettings || {}),
  });

  const [textSettings, setTextSettings] = useState({
    brandName: platformConfig.brandName || "DAVETECH",
    name: platformConfig.name || "DAVETECH Software & Cloud Solutions",
    tagline: platformConfig.tagline || "Enterprise Multi-Tenant Educational Operating System & Cloud",
    heroTitle: platformConfig.heroTitle || "Enterprise Technology Built for Scale.",
    heroHighlight: platformConfig.heroHighlight || "School ERP, POS, Web & Custom Cloud.",
    heroSubtitle:
      platformConfig.heroSubtitle ||
      "DAVETECH delivers battle-tested software systems across Kenya and East Africa. Choose from our complete educational ERP platform, fast retail POS system, high-converting corporate websites, or bespoke custom software engineering.",
    heroBadgeText: platformConfig.heroBadgeText || "4 Flagship Cloud Packages",
    announcementBanner:
      platformConfig.announcementBanner ||
      "🚀 Davetech Cloud v4.2 Release: Live Automated CBC Assessments, Real-Time Fee Gateways & Multi-Campus Syncing Now Live!",
    supportEmail: platformConfig.supportEmail || "contact@davetech.co.ke",
    supportPhone: platformConfig.supportPhone || "+254 700 000 123",
    whatsappPhone: platformConfig.whatsappPhone || "+254 700 000 123",
    address: platformConfig.address || "Davetech Innovation Tower, Upper Hill, Nairobi, Kenya",
    websiteUrl: platformConfig.websiteUrl || "https://davetecherp.com",
    primaryColor: platformConfig.primaryColor || "#4f46e5",
    logo: platformConfig.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200",
  });

  const [activeSlidePreviewIndex, setActiveSlidePreviewIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"slides" | "typography" | "filters" | "content" | "contact">("slides");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);
  const [uploadingNewSlide, setUploadingNewSlide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const [targetSlideForUpload, setTargetSlideForUpload] = useState<string | null>(null);

  // Sync with context if updated externally
  useEffect(() => {
    if (platformConfig.heroSlides && platformConfig.heroSlides.length > 0) {
      setSlides(platformConfig.heroSlides);
    }
    if (platformConfig.heroVisualSettings) {
      setVisualSettings({
        ...defaultVisual,
        ...platformConfig.heroVisualSettings,
      });
    }
  }, [platformConfig]);

  // Handle image upload for new slide
  const handleAddNewSlideFromFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    setUploadingNewSlide(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, {
        maxWidth: 1600,
        maxHeight: 900,
        quality: 0.85,
      });
      const newSlide: HeroSlide = {
        id: `slide_${Date.now()}`,
        imageUrl: dataUrl,
        title: "New Featured Slide",
        subtitle: "Add compelling description of your technology solution",
        caption: "DAVETECH Cloud Platform",
      };
      setSlides((prev) => [...prev, newSlide]);
      setActiveSlidePreviewIndex(slides.length);
    } catch (err) {
      console.error("Failed to process slide image:", err);
      alert("Failed to process image. Please try another image file.");
    } finally {
      setUploadingNewSlide(false);
    }
  };

  // Handle replace image for existing slide
  const handleReplaceSlideImage = async (file: File, slideId: string) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setUploadingSlideId(slideId);
    try {
      const dataUrl = await compressImageToDataUrl(file, {
        maxWidth: 1600,
        maxHeight: 900,
        quality: 0.85,
      });
      setSlides((prev) =>
        prev.map((s) => (s.id === slideId ? { ...s, imageUrl: dataUrl } : s))
      );
    } catch (err) {
      console.error("Error compressing slide image:", err);
      alert("Failed to process image.");
    } finally {
      setUploadingSlideId(null);
      setTargetSlideForUpload(null);
    }
  };

  const handleAddSlideByUrl = () => {
    const url = prompt(
      "Enter image URL for the new hero slide:",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80"
    );
    if (!url) return;
    const newSlide: HeroSlide = {
      id: `slide_${Date.now()}`,
      imageUrl: url,
      title: "Enterprise Solutions",
      subtitle: "Scalable cloud architectures built for institutional excellence",
      caption: "DAVETECH Innovation",
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlidePreviewIndex(slides.length);
  };

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert("You must keep at least 1 hero slide.");
      return;
    }
    const filtered = slides.filter((s) => s.id !== id);
    setSlides(filtered);
    setActiveSlidePreviewIndex(0);
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);
    setActiveSlidePreviewIndex(targetIndex);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updatePlatformConfig({
        ...platformConfig,
        ...textSettings,
        heroSlides: slides,
        heroVisualSettings: visualSettings,
        updatedAt: new Date().toISOString(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Error saving website CMS config:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper styles based on settings for live preview
  const currentPreviewSlide = slides[activeSlidePreviewIndex] || slides[0];

  const getFontFamilyClass = (family: string) => {
    switch (family) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      case "tech":
        return "font-mono tracking-tight";
      case "display":
        return "font-black tracking-tight";
      default:
        return "font-sans";
    }
  };

  const getFontSizeClass = (size: string) => {
    switch (size) {
      case "compact":
        return "text-xl sm:text-2xl lg:text-3xl";
      case "standard":
        return "text-2xl sm:text-3xl lg:text-4xl";
      case "huge":
        return "text-4xl sm:text-5xl lg:text-6xl";
      default:
        return "text-3xl sm:text-4xl lg:text-5xl";
    }
  };

  const getFontStyleClass = (style: string) => {
    switch (style) {
      case "italic":
        return "italic font-semibold";
      case "normal":
        return "font-medium not-italic";
      case "extra-bold":
        return "font-black not-italic";
      default:
        return "font-extrabold not-italic";
    }
  };

  const getAlignmentClass = (align: string) => {
    switch (align) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAddNewSlideFromFile(file);
          e.target.value = "";
        }}
      />
      <input
        type="file"
        ref={slideFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && targetSlideForUpload) {
            handleReplaceSlideImage(file, targetSlideForUpload);
          }
          e.target.value = "";
        }}
      />

      {/* Header bar with actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <Sliders className="w-3.5 h-3.5" />
            <span>Public Website Visual Customizer & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hero Slide & Website Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Upload custom hero slide photos, configure font alignment, sizes, and styling, and adjust background photo transparency and overlay colors with instant live preview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode("davetech_home")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>View Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Website customizations published successfully! Changes are live across all public portals.</span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode("davetech_home")}
            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
          >
            View Live Site →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL-TIME LIVE HERO PREVIEW STAGE */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-white">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Live Interactive Hero Stage Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Slide {activeSlidePreviewIndex + 1} of {slides.length}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Live Canvas Mockup */}
        <div className="relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-6 sm:p-12 border border-slate-800 bg-slate-950">
          {/* Background Image Layer with User's Photo Transparency, Blur, Brightness, and Object-Fit */}
          {currentPreviewSlide && (
            <div
              className="absolute inset-0 transition-all duration-700 pointer-events-none"
              style={{
                opacity: visualSettings.photoTransparency / 100,
                filter: `blur(${visualSettings.imageBlur}px) brightness(${visualSettings.imageBrightness}%)`,
              }}
            >
              <img
                src={currentPreviewSlide.imageUrl}
                alt={currentPreviewSlide.title || "Hero Slide"}
                className={`w-full h-full object-${visualSettings.imageFit}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600";
                }}
              />
            </div>
          )}

          {/* Dark Overlay Tint Layer with User's Custom Color and Opacity */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: visualSettings.overlayColor || "#020617",
              opacity: visualSettings.overlayOpacity / 100,
            }}
          />

          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Slide Caption Pill (Top Left / Right) */}
          {currentPreviewSlide?.caption && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-indigo-300 border border-white/10">
              📍 {currentPreviewSlide.caption}
            </div>
          )}

          {/* Foreground Text Content with dynamic Alignment, Size, Weight, and Family */}
          <div
            className={`relative z-20 w-full max-w-3xl flex flex-col ${getAlignmentClass(
              visualSettings.fontAlignment
            )} space-y-4 text-white transition-all`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-white font-bold">{textSettings.brandName} Enterprise Suite</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400">{textSettings.heroBadgeText}</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`${getFontSizeClass(visualSettings.fontSize)} ${getFontFamilyClass(
                visualSettings.fontFamily
              )} ${getFontStyleClass(
                visualSettings.fontStyle
              )} tracking-tight leading-tight transition-all`}
            >
              <span>{textSettings.heroTitle} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
                {textSettings.heroHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl ${
                visualSettings.fontAlignment === "center" ? "mx-auto" : ""
              }`}
            >
              {currentPreviewSlide?.subtitle || textSettings.heroSubtitle}
            </p>

            {/* Demo CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
                Launch School ERP Demo →
              </span>
              <span className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                Try POS Terminal
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold">
                Calculate Custom Quote
              </span>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlidePreviewIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  activeSlidePreviewIndex === idx
                    ? "w-6 h-2 bg-indigo-400"
                    : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
                }`}
                title={`Preview Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CMS NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("slides")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "slides"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>1. Hero Slide Photos ({slides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "typography"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>2. Font Alignment & Typography</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("filters")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "filters"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>3. Photo Transparency & Overlay</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "content"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Headings & Announcement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "contact"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>5. Contact & Privacy Settings</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO SLIDE PHOTO MANAGER */}
      {/* ========================================================================= */}
      {activeTab === "slides" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Hero Slide Photos</h3>
              <p className="text-xs text-slate-500">
                Upload custom high-resolution photos for the rotating hero carousel or enter image links.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingNewSlide}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {uploadingNewSlide ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Photo from Computer</span>
              </button>
              <button
                type="button"
                onClick={handleAddSlideByUrl}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add by URL</span>
              </button>
            </div>
          </div>

          {/* List of slides */}
          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, index) => {
              const isSelected = activeSlidePreviewIndex === index;
              return (
                <div
                  key={slide.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Thumbnail with overlay preview */}
                    <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 group">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTargetSlideForUpload(slide.id);
                            slideFileInputRef.current?.click();
                          }}
                          className="p-2 rounded-lg bg-white/90 text-slate-900 text-xs font-bold hover:bg-white shadow-md cursor-pointer"
                          title="Replace image"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSlidePreviewIndex(index)}
                          className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md cursor-pointer"
                          title="Preview in stage"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">
                        Slide #{index + 1}
                      </span>
                    </div>

                    {/* Editable fields */}
                    <div className="flex-1 w-full space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Slide Title / Subheading
                          </label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                            placeholder="e.g. Autonomous School ERP & CBC Systems"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Location / Badge Caption
                          </label>
                          <input
                            type="text"
                            value={slide.caption || ""}
                            onChange={(e) => handleUpdateSlide(slide.id, { caption: e.target.value })}
                            placeholder="e.g. Smart Educational Cloud"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Slide Description / Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ""}
                          onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })}
                          placeholder="e.g. Automated report cards, student profiles, and multi-campus synchronization"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Direct Image URL
                        </label>
                        <input
                          type="text"
                          value={slide.imageUrl}
                          onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Order & delete controls */}
                    <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setActiveSlidePreviewIndex(index)}
                        className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Set as preview slide"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, "up")}
                        disabled={index === 0}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, "down")}
                        disabled={index === slides.length - 1}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TYPOGRAPHY & FONT ALIGNMENT */}
      {/* ========================================================================= */}
      {activeTab === "typography" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Font Alignment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-indigo-600" />
                <span>Headline & Text Alignment</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose how hero headlines, subheadings, and action buttons align on the page.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  setVisualSettings((prev) => ({ ...prev, fontAlignment: "left" }))
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  visualSettings.fontAlignment === "left"
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <AlignLeft className="w-6 h-6" />
                <span>Left Aligned</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setVisualSettings((prev) => ({ ...prev, fontAlignment: "center" }))
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  visualSettings.fontAlignment === "center"
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <AlignCenter className="w-6 h-6" />
                <span>Center Aligned</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setVisualSettings((prev) => ({ ...prev, fontAlignment: "right" }))
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  visualSettings.fontAlignment === "right"
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <AlignRight className="w-6 h-6" />
                <span>Right Aligned</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-600" />
                <span>Headline Font Size Scale</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select visual impact and proportions of hero display headlines.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "compact", label: "Compact", sub: "Discreet & dense" },
                { id: "standard", label: "Standard", sub: "Balanced medium" },
                { id: "large", label: "Large (Default)", sub: "Bold & impactful" },
                { id: "huge", label: "Huge Display", sub: "Maximum presence" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setVisualSettings((prev) => ({
                      ...prev,
                      fontSize: opt.id as any,
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    visualSettings.fontSize === opt.id
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-500">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>Typography Family</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Paired font families for website aesthetics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "sans", label: "Modern Sans", sample: "DAVETECH Cloud" },
                { id: "serif", label: "Editorial Serif", sample: "DAVETECH Cloud" },
                { id: "tech", label: "Tech Mono Grid", sample: "DAVETECH_CLOUD" },
                { id: "display", label: "Display Extra-Black", sample: "DAVETECH CLOUD" },
              ].map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() =>
                    setVisualSettings((prev) => ({
                      ...prev,
                      fontFamily: fam.id as any,
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    visualSettings.fontFamily === fam.id
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{fam.label}</div>
                  <div className="text-[11px] text-indigo-600 font-mono mt-0.5">
                    {fam.sample}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Style & Weight */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Font Weight & Styling</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Visual emphasis and weight of the main slogan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "normal", label: "Normal Medium", sub: "Weight 500" },
                { id: "italic", label: "Italic Dynamic", sub: "Italicised emphasis" },
                { id: "bold", label: "Bold (Standard)", sub: "Weight 700" },
                { id: "extra-bold", label: "Extra-Black 900", sub: "Ultra strong" },
              ].map((styleOpt) => (
                <button
                  key={styleOpt.id}
                  type="button"
                  onClick={() =>
                    setVisualSettings((prev) => ({
                      ...prev,
                      fontStyle: styleOpt.id as any,
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    visualSettings.fontStyle === styleOpt.id
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold">{styleOpt.label}</div>
                  <div className="text-[11px] text-slate-500">{styleOpt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PHOTO TRANSPARENCY & OVERLAY FILTERS */}
      {/* ========================================================================= */}
      {activeTab === "filters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Photo Transparency Slider */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Photo Transparency (Opacity)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust image visibility (100% = fully opaque photo, 0% = invisible).
                </p>
              </div>
              <span className="text-sm font-black text-indigo-600 font-mono bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {visualSettings.photoTransparency}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={visualSettings.photoTransparency}
              onChange={(e) =>
                setVisualSettings((prev) => ({
                  ...prev,
                  photoTransparency: Number(e.target.value),
                }))
              }
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>10% (Subtle Watermark)</span>
              <span>85% (Balanced)</span>
              <span>100% (Full Photo)</span>
            </div>
          </div>

          {/* Dark Overlay Tint Slider */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>Dark Tint Overlay Strength</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dark gradient layer ensuring headline text readability.
                </p>
              </div>
              <span className="text-sm font-black text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {visualSettings.overlayOpacity}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={visualSettings.overlayOpacity}
              onChange={(e) =>
                setVisualSettings((prev) => ({
                  ...prev,
                  overlayOpacity: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-800 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0% (No Tint)</span>
              <span>75% (Recommended)</span>
              <span>100% (Pitch Dark)</span>
            </div>
          </div>

          {/* Overlay Tint Color */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Overlay Color Theme</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the background tint hue behind text.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: "Deep Midnight", color: "#020617" },
                { name: "Slate Navy", color: "#0f172a" },
                { name: "Indigo Night", color: "#1e1b4b" },
                { name: "Charcoal Black", color: "#18181b" },
                { name: "Pure Pitch Black", color: "#000000" },
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() =>
                    setVisualSettings((prev) => ({ ...prev, overlayColor: c.color }))
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    visualSettings.overlayColor === c.color
                      ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-slate-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-400"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blur & Brightness Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Image Blur & Brightness</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Soft optical focus effects on background photos.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Image Blur Filter</span>
                  <span className="font-mono text-indigo-600">{visualSettings.imageBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={visualSettings.imageBlur}
                  onChange={(e) =>
                    setVisualSettings((prev) => ({
                      ...prev,
                      imageBlur: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Image Brightness</span>
                  <span className="font-mono text-indigo-600">
                    {visualSettings.imageBrightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={visualSettings.imageBrightness}
                  onChange={(e) =>
                    setVisualSettings((prev) => ({
                      ...prev,
                      imageBrightness: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HEADINGS, HIGHLIGHTS & SLOGANS */}
      {/* ========================================================================= */}
      {activeTab === "content" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900">Website Headings & Slogans</h3>
            <p className="text-xs text-slate-500">
              Customize the main slogans, gradient highlight words, and pitch text.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Main Hero Slogan Title
              </label>
              <input
                type="text"
                value={textSettings.heroTitle}
                onChange={(e) =>
                  setTextSettings((prev) => ({ ...prev, heroTitle: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gradient Highlight Phrase (Colorful Text)
              </label>
              <input
                type="text"
                value={textSettings.heroHighlight}
                onChange={(e) =>
                  setTextSettings((prev) => ({ ...prev, heroHighlight: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hero Subtitle / Description Paragraph
              </label>
              <textarea
                rows={3}
                value={textSettings.heroSubtitle}
                onChange={(e) =>
                  setTextSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Badge Tagline
                </label>
                <input
                  type="text"
                  value={textSettings.heroBadgeText}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, heroBadgeText: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={textSettings.brandName}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, brandName: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Announcement Banner Text (Top of Public Website)
              </label>
              <input
                type="text"
                value={textSettings.announcementBanner}
                onChange={(e) =>
                  setTextSettings((prev) => ({ ...prev, announcementBanner: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CONTACT & PRIVACY SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 space-y-1">
              <div className="font-bold">Public Contact Privacy Active</div>
              <p className="text-indigo-700 leading-relaxed">
                Your private email is strictly protected and never displayed on public pages. The official business email configured below is what website visitors and clients see.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Public Business Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={textSettings.supportEmail}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, supportEmail: e.target.value }))
                  }
                  placeholder="contact@davetech.co.ke"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Public Support Telephone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={textSettings.supportPhone}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, supportPhone: e.target.value }))
                  }
                  placeholder="+254 700 000 123"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Business Line
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={textSettings.whatsappPhone}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, whatsappPhone: e.target.value }))
                  }
                  placeholder="+254 700 000 123"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headquarters Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={textSettings.address}
                  onChange={(e) =>
                    setTextSettings((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Upper Hill, Nairobi, Kenya"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
