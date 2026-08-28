import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { TenantWebsiteConfig, HeroSlide } from "../../types";
import {
  subscribeToWebsiteConfig,
  saveWebsiteConfig,
  uploadFileToStorage,
} from "../../services/firestoreService";
import {
  Globe,
  Save,
  Eye,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
} from "lucide-react";

interface WebsiteManagerProps {
  onPreviewPublic?: () => void;
  onPreviewWebsite?: () => void;
}

export const WebsiteManager: React.FC<WebsiteManagerProps> = ({
  onPreviewPublic,
  onPreviewWebsite,
}) => {
  const handlePreview = onPreviewPublic || onPreviewWebsite || (() => {});
  const { currentTenant, currentUser } = useTenant();

  const [config, setConfig] = useState<TenantWebsiteConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!currentTenant) return;
    const unsub = subscribeToWebsiteConfig(currentTenant.id, (cfg) => {
      if (cfg) {
        // Ensure heroSlides array exists
        const slides = cfg.heroSlides && cfg.heroSlides.length > 0 ? cfg.heroSlides : [
          {
            id: "slide_1",
            title: cfg.heroHeadline || `Welcome to ${currentTenant.name}`,
            subtitle: cfg.heroSubtitle || currentTenant.motto || "Nurturing excellence, character, and innovative leadership for the modern world.",
            imageUrl: cfg.heroImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
            buttonText: "Enroll for 2026",
            buttonLink: "#admissions",
          },
          {
            id: "slide_2",
            title: "Holistic CBC & STEM Innovation Hub",
            subtitle: "Empowering young minds with modern science laboratories, robotics, and coding curricula.",
            imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
            buttonText: "Explore Curriculum",
            buttonLink: "#about",
          },
          {
            id: "slide_3",
            title: "Vibrant Sports & Co-Curricular Excellence",
            subtitle: "State-of-the-art athletics, music conservatory, and leadership development programs.",
            imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200",
            buttonText: "View Campus Life",
            buttonLink: "#features",
          },
        ];
        setConfig({ ...cfg, heroSlides: slides });
      } else {
        // Default initial website configuration
        setConfig({
          id: currentTenant.id,
          tenantId: currentTenant.id,
          title: currentTenant.name,
          tagline: currentTenant.motto || "Excellence in Education",
          heroHeadline: `Welcome to ${currentTenant.name}`,
          heroSubtitle: currentTenant.motto || "Nurturing excellence, character, and innovative leadership for the modern world.",
          heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
          logoUrl: currentTenant.logo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160",
          heroSlides: [
            {
              id: "slide_1",
              title: `Welcome to ${currentTenant.name}`,
              subtitle: currentTenant.motto || "Nurturing excellence, character, and innovative leadership.",
              imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
              buttonText: "Enroll for 2026",
              buttonLink: "#admissions",
            },
            {
              id: "slide_2",
              title: "Holistic CBC & STEM Innovation Hub",
              subtitle: "Empowering young minds with modern science laboratories, robotics, and coding curricula.",
              imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
              buttonText: "Explore Curriculum",
              buttonLink: "#about",
            },
            {
              id: "slide_3",
              title: "Vibrant Sports & Co-Curricular Excellence",
              subtitle: "State-of-the-art athletics, music conservatory, and leadership development programs.",
              imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200",
              buttonText: "View Campus Life",
              buttonLink: "#features",
            },
          ],
          aboutUs: `${currentTenant.name} is a premier educational institution committed to transformative learning and holistic character development.`,
          features: [
            {
              title: "Holistic Competency Learning",
              description: "Full alignment with modern CBC and accredited vocational training standards.",
              icon: "BookOpen",
            },
            {
              title: "Modern Tech & Laboratories",
              description: "State-of-the-art computer centers, science labs, and interactive smart boards.",
              icon: "Laptop",
            },
            {
              title: "Co-Curricular & Sports Excellence",
              description: "Vibrant clubs, music, athletics, and international exchange programs.",
              icon: "Award",
            },
          ],
          programsOffered: [
            {
              name: "CBC Primary Curriculum (Grade 1 - 6)",
              description: "Comprehensive foundational skills in STEM, Languages, and Arts.",
              level: "Primary",
            },
            {
              name: "Junior Secondary (Grade 7 - 9)",
              description: "Advanced preparation for senior pathways and talent development.",
              level: "Junior Secondary",
            },
          ],
          contactEmail: currentTenant.email,
          contactPhone: currentTenant.phone,
          admissionsOpen: true,
          updatedAt: new Date().toISOString(),
        });
      }
    });
    return () => unsub();
  }, [currentTenant?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !config) return;

    setIsSaving(true);
    // Keep first slide sync with heroHeadline and heroImage for backward compatibility
    const firstSlide = config.heroSlides?.[0];
    const payload: TenantWebsiteConfig = {
      ...config,
      heroHeadline: firstSlide?.title || config.heroHeadline,
      heroSubtitle: firstSlide?.subtitle || config.heroSubtitle,
      heroImage: firstSlide?.imageUrl || config.heroImage,
      updatedAt: new Date().toISOString(),
    };

    await saveWebsiteConfig(currentTenant.id, payload, { name: currentUser.name });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogoUpload = async (file: File) => {
    if (!currentTenant || !config) return;
    setUploadingLogo(true);
    try {
      let finalUrl = "";
      try {
        finalUrl = await uploadFileToStorage(currentTenant.id, "website_logo", file);
      } catch {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      setConfig({ ...config, logoUrl: finalUrl });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSlideImageUpload = async (slideIndex: number, file: File) => {
    if (!currentTenant || !config || !config.heroSlides) return;
    try {
      let url = "";
      try {
        url = await uploadFileToStorage(currentTenant.id, `slide_${slideIndex}`, file);
      } catch {
        url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      const nextSlides = [...config.heroSlides];
      nextSlides[slideIndex] = { ...nextSlides[slideIndex], imageUrl: url };
      setConfig({ ...config, heroSlides: nextSlides });
    } catch (err) {
      console.error("Slide upload error:", err);
    }
  };

  const handleAddHeroSlide = () => {
    if (!config) return;
    const currentCount = (config.heroSlides || []).length;
    const newSlide: HeroSlide = {
      id: "slide_" + Date.now(),
      title: `Academic Excellence & Pathway ${currentCount + 1}`,
      subtitle: "Join our vibrant academic community with dedicated faculty and modern learning resources.",
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200",
      buttonText: "Apply Today",
      buttonLink: "#admissions",
    };
    setConfig({
      ...config,
      heroSlides: [...(config.heroSlides || []), newSlide],
    });
  };

  const handleDeleteHeroSlide = (index: number) => {
    if (!config || !config.heroSlides) return;
    if (config.heroSlides.length <= 1) {
      alert("At least one hero banner slide is required.");
      return;
    }
    const nextSlides = [...config.heroSlides];
    nextSlides.splice(index, 1);
    setConfig({ ...config, heroSlides: nextSlides });
  };

  if (!config) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading website configuration...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>Public Website CMS & Multi-Slide Hero Editor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize your institution&apos;s public website, interactive multi-hero carousel slides, branding logo, and admissions portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview Live Public Site</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Publishing..." : "Publish Website Changes"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Website configuration and hero slides published successfully to Firestore!</span>
        </div>
      )}

      {/* Main CMS Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hero Slides & About */}
        <div className="lg:col-span-2 space-y-6">
          {/* MULTI-HERO SLIDES CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>1. Multi-Hero Banner Carousel ({config.heroSlides?.length || 0} Slides)</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Add multiple hero slides that automatically cycle with smooth transitions on your public homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddHeroSlide}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            {/* Slide List */}
            <div className="space-y-4">
              {config.heroSlides?.map((slide, index) => (
                <div
                  key={slide.id || index}
                  className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50/70 space-y-3 relative hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded">
                      Slide #{index + 1}
                    </span>

                    {config.heroSlides && config.heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteHeroSlide(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Headline Title *</label>
                    <input
                      type="text"
                      required
                      value={slide.title}
                      onChange={(e) => {
                        const copy = [...(config.heroSlides || [])];
                        copy[index] = { ...copy[index], title: e.target.value };
                        setConfig({ ...config, heroSlides: copy });
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => {
                        const copy = [...(config.heroSlides || [])];
                        copy[index] = { ...copy[index], subtitle: e.target.value };
                        setConfig({ ...config, heroSlides: copy });
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Background Image</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={slide.imageUrl}
                        alt=""
                        className="w-20 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                      />
                      <input
                        type="text"
                        value={slide.imageUrl}
                        onChange={(e) => {
                          const copy = [...(config.heroSlides || [])];
                          copy[index] = { ...copy[index], imageUrl: e.target.value };
                          setConfig({ ...config, heroSlides: copy });
                        }}
                        placeholder="Image URL"
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                      />
                      <label className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5 inline mr-1" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleSlideImageUpload(index, e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Action Button Text</label>
                      <input
                        type="text"
                        value={slide.buttonText || "Enroll Today"}
                        onChange={(e) => {
                          const copy = [...(config.heroSlides || [])];
                          copy[index] = { ...copy[index], buttonText: e.target.value };
                          setConfig({ ...config, heroSlides: copy });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Action Button Link / Target</label>
                      <input
                        type="text"
                        value={slide.buttonLink || "#admissions"}
                        onChange={(e) => {
                          const copy = [...(config.heroSlides || [])];
                          copy[index] = { ...copy[index], buttonLink: e.target.value };
                          setConfig({ ...config, heroSlides: copy });
                        }}
                        placeholder="#admissions or URL"
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Us Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. About Our Institution
            </h2>
            <textarea
              rows={4}
              value={config.aboutUs}
              onChange={(e) => setConfig({ ...config, aboutUs: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed"
            />
          </div>

          {/* Features Highlights */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Key Strengths & Unique Pillars
            </h2>
            <div className="space-y-3">
              {config.features?.map((feat, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const copy = [...(config.features || [])];
                      copy[i].title = e.target.value;
                      setConfig({ ...config, features: copy });
                    }}
                    placeholder="Feature Title"
                    className="w-full p-2 rounded border border-slate-200 text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => {
                      const copy = [...(config.features || [])];
                      copy[i].description = e.target.value;
                      setConfig({ ...config, features: copy });
                    }}
                    placeholder="Feature Description"
                    className="w-full p-2 rounded border border-slate-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Logo, Admissions & Contacts */}
        <div className="space-y-6">
          {/* Website Logo Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Public Website Logo</span>
            </h2>

            <div className="flex items-center gap-3">
              <img
                src={config.logoUrl || currentTenant?.logo || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120"}
                alt="Website Logo"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
              />
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={config.logoUrl || ""}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="https://... logo URL"
                  className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] font-mono"
                />
                <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg cursor-pointer border border-indigo-200">
                  <Upload className="w-3 h-3" />
                  <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Admissions Toggle */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Online Admissions Status
            </h2>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer">
              <input
                type="checkbox"
                checked={config.admissionsOpen}
                onChange={(e) => setConfig({ ...config, admissionsOpen: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <div>
                <div className="text-xs font-bold text-indigo-950">Admissions Are Currently Open</div>
                <div className="text-[10px] text-indigo-700">
                  Enables the online prospective student application form on your public site.
                </div>
              </div>
            </label>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Public Inquiries & Contact
            </h2>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Inquiry Email</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Telephone / WhatsApp</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
