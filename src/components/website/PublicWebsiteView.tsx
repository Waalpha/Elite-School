import React, { useState, useEffect, useRef } from "react";
import { useTenant } from "../../context/TenantContext";
import type { TenantWebsiteConfig, Student, HeroSlide } from "../../types";
import {
  subscribeToWebsiteConfig,
  saveStudent,
} from "../../services/firestoreService";
import {
  School,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  BookOpen,
  Laptop,
  Users,
  X,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

export const PublicWebsiteView: React.FC = () => {
  const { currentTenant, setViewMode, currentBranch } = useTenant();

  const [config, setConfig] = useState<TenantWebsiteConfig | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Hero carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  // Application form state
  const [applicantForm, setApplicantForm] = useState({
    firstName: "",
    lastName: "",
    gender: "male" as "male" | "female",
    dateOfBirth: "2016-01-01",
    gradeOrClass: "Grade 1",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    medicalInfo: "None",
  });

  useEffect(() => {
    if (!currentTenant) return;
    const unsub = subscribeToWebsiteConfig(currentTenant.id, (cfg) => {
      if (cfg) setConfig(cfg);
    });
    return () => unsub();
  }, [currentTenant?.id]);

  // Extract slides or fallback
  const slides: HeroSlide[] =
    config?.heroSlides && config.heroSlides.length > 0
      ? config.heroSlides
      : [
          {
            id: "default_1",
            title: config?.heroHeadline || `Welcome to ${currentTenant?.name || "Our Institution"}`,
            subtitle:
              config?.heroSubtitle ||
              currentTenant?.motto ||
              "Nurturing excellence, character, and innovative leadership for the modern world.",
            imageUrl:
              config?.heroImage ||
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
            buttonText: "Enroll for 2026",
            buttonLink: "#admissions",
          },
          {
            id: "default_2",
            title: "Holistic CBC & STEM Innovation Hub",
            subtitle:
              "Empowering young minds with modern science laboratories, robotics, and coding curricula.",
            imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
            buttonText: "Explore Curriculum",
            buttonLink: "#about",
          },
          {
            id: "default_3",
            title: "Vibrant Sports & Co-Curricular Excellence",
            subtitle:
              "State-of-the-art athletics, music conservatory, and leadership development programs.",
            imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200",
            buttonText: "View Campus Life",
            buttonLink: "#features",
          },
        ];

  // Auto-slide carousel effect
  useEffect(() => {
    if (slides.length <= 1 || isAutoPlayPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length, isAutoPlayPaused]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const isPrimary =
    currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";

  const handleOnlineApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const admNo = `${currentTenant.code}-ONLINE-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload: Student = {
      id: "std_online_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      admissionNo: admNo,
      firstName: applicantForm.firstName,
      lastName: applicantForm.lastName,
      gender: applicantForm.gender,
      dateOfBirth: applicantForm.dateOfBirth,
      educationLevel: isPrimary ? "primary" : "college",
      gradeOrClass: applicantForm.gradeOrClass,
      academicYear: "2026",
      termOrSemester: "Term 1",
      guardianName: applicantForm.guardianName,
      guardianPhone: applicantForm.guardianPhone,
      guardianEmail: applicantForm.guardianEmail,
      guardianRelationship: "Parent",
      medicalInfo: applicantForm.medicalInfo,
      photoUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200",
      status: "active",
      totalFeeBilled: 35000,
      totalFeePaid: 0,
      balance: 35000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudent(currentTenant.id, payload, { name: "Online Public Portal" });
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setIsApplyModalOpen(false);
    }, 2500);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const logoUrl =
    config?.logoUrl ||
    currentTenant?.logo ||
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Banner with ERP Return Switcher */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">Public Website Live Preview Mode</span>
          <span className="text-slate-400 hidden sm:inline">
            • Active Tenant: {currentTenant?.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setViewMode("erp")}
          className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to ERP Portal</span>
        </button>
      </div>

      {/* Website Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={currentTenant?.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {currentTenant?.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {currentTenant?.motto || "Nurturing Future Leaders"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Apply Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MULTI-SLIDE HERO SECTION */}
      <section
        className="relative overflow-hidden bg-slate-950 text-white min-h-[520px] lg:min-h-[600px] flex items-center"
        onMouseEnter={() => setIsAutoPlayPaused(true)}
        onMouseLeave={() => setIsAutoPlayPaused(false)}
      >
        {/* Background Slide Images with Crossfade */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? "opacity-35 z-0 scale-100" : "opacity-0 -z-10 scale-105"
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-7000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-16 w-full">
          <div className="max-w-2xl space-y-6 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admissions Open for Academic Year 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight min-h-[80px] sm:min-h-[120px] flex items-center">
              {currentSlide.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed min-h-[48px]">
              {currentSlide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (currentSlide.buttonLink === "#about") {
                    document.getElementById("about_section")?.scrollIntoView({ behavior: "smooth" });
                  } else if (currentSlide.buttonLink === "#features") {
                    document.getElementById("features_section")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    setIsApplyModalOpen(true);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                {currentSlide.buttonText || "Enroll Your Child Today"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("about_section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all"
              >
                Explore Curriculum
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md transition-all"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 backdrop-blur-md transition-all"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Dots & Controls Indicator */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? "w-8 bg-indigo-500"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] text-slate-400 font-mono ml-1">
              {currentSlideIndex + 1}/{slides.length}
            </span>
          </div>
        )}
      </section>

      {/* About & Mission Section */}
      <section id="about_section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              About Our Institution
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Committed to Holistic Growth, Innovation & Character
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {config?.aboutUs ||
                `${currentTenant?.name} is dedicated to fostering an engaging, supportive environment where learners develop critical thinking, creative problem-solving, and sound moral values.`}
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Accredited Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dedicated Faculty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Modern Science Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Active Sports & Clubs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600"
              alt="Classroom"
              className="rounded-2xl object-cover h-48 sm:h-64 w-full shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600"
              alt="Learning"
              className="rounded-2xl object-cover h-48 sm:h-64 w-full shadow-md mt-6"
            />
          </div>
        </div>
      </section>

      {/* Offerings & Pillars Grid */}
      <section id="features_section" className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isPrimary ? "Academic Pathways & Learning Tiers" : "Our Academic Programs"}
            </h3>
            <p className="text-xs text-slate-500">
              Designed to equip learners with future-ready skills, practical competencies, and certified qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {isPrimary ? "Early Years Education (PP1 - PP2)" : "Diploma in Computer Science & ICT"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isPrimary
                  ? "Foundational literacy, numeracy, psychomotor stimulation, and creative play in a safe, nurturing environment."
                  : "Comprehensive software development, networking, database administration, and cloud engineering."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {isPrimary ? "Primary CBC (Grade 1 - Grade 6)" : "Business Administration & Management"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isPrimary
                  ? "Comprehensive CBC curriculum spanning Science & Tech, Mathematics, English, Kiswahili, and Creative Arts."
                  : "Strategic leadership, finance, marketing, and entrepreneurship preparing graduates for corporate excellence."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {isPrimary ? "Junior Secondary (Grade 7 - Grade 9)" : "Professional Accounting (CPA Kenya)"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isPrimary
                  ? "Integrated science, pre-technical studies, computer science, and career pathway discovery."
                  : "KASNEB accredited training with high pass rates and industry internship placement assistance."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="" className="w-8 h-8 rounded-lg object-cover bg-white" />
              <h4 className="text-white font-bold text-sm">{currentTenant?.name}</h4>
            </div>
            <p className="text-slate-400">{currentTenant?.motto}</p>
            <div className="text-slate-500">© 2026 DAVETECH ERP Multi-Tenant Platform</div>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-bold">Contact & Location</h5>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{currentTenant?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{currentTenant?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{currentTenant?.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold">Administration</h5>
            <button
              type="button"
              onClick={() => setViewMode("erp")}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
            >
              Sign In to Staff & Admin ERP
            </button>
          </div>
        </div>
      </footer>

      {/* ONLINE APPLICATION MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Online Admission Application
                </h3>
                <p className="text-xs text-slate-500">{currentTenant?.name}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-500">
                  Your admission request has been sent to our admissions registrar team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOnlineApplication} className="mt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Learner First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantForm.firstName}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, firstName: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Learner Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantForm.lastName}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, lastName: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={applicantForm.gender}
                      onChange={(e) =>
                        setApplicantForm({
                          ...applicantForm,
                          gender: e.target.value as "male" | "female",
                        })
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Applying For Class / Grade *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grade 4, PP1, Year 1"
                      value={applicantForm.gradeOrClass}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, gradeOrClass: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                  <div className="font-bold text-indigo-950">Parent / Guardian Contact</div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      Parent Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantForm.guardianName}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, guardianName: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+254 7..."
                        value={applicantForm.guardianPhone}
                        onChange={(e) =>
                          setApplicantForm({ ...applicantForm, guardianPhone: e.target.value })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={applicantForm.guardianEmail}
                        onChange={(e) =>
                          setApplicantForm({ ...applicantForm, guardianEmail: e.target.value })
                        }
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
