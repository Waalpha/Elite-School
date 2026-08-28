import React, { useState } from "react";
import { savePublicInquiry } from "../../services/firestoreService";
import type { PublicInquiry } from "../../types";
import {
  X,
  Calculator,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Globe,
  Cpu,
  Layers,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Coins,
  FileCode,
  ArrowRight,
} from "lucide-react";

interface SoftwareEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoftwareEstimatorModal: React.FC<SoftwareEstimatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [projectType, setProjectType] = useState<string>("mobile_app");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["web_portal", "mobile_android"]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth_rbac",
    "mpesa_fintech",
    "pdf_reporting",
  ]);
  const [timelineSpeed, setTimelineSpeed] = useState<string>("standard");
  const [userScale, setUserScale] = useState<string>("growing");

  // Contact info for submission
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const projectTypesList = [
    { id: "mobile_app", label: "Mobile App (iOS & Android)", baseCost: 65000, baseWeeks: 4 },
    { id: "saas_web", label: "Enterprise Web SaaS / Portal", baseCost: 75000, baseWeeks: 5 },
    { id: "fintech_api", label: "FinTech & M-Pesa Engine", baseCost: 45000, baseWeeks: 3 },
    { id: "custom_erp", label: "Custom ERP / Business OS", baseCost: 95000, baseWeeks: 6 },
    { id: "ai_automation", label: "AI & Automated Workflows", baseCost: 55000, baseWeeks: 3 },
  ];

  const platformsList = [
    { id: "web_portal", label: "Web Portal (React/TypeScript)", cost: 20000 },
    { id: "mobile_android", label: "Android Mobile App (Flutter)", cost: 25000 },
    { id: "mobile_ios", label: "iOS Mobile App (Swift/Flutter)", cost: 30000 },
    { id: "cloud_api", label: "Serverless Cloud Microservices", cost: 18000 },
  ];

  const featuresList = [
    { id: "auth_rbac", label: "Multi-Role RBAC & Audit Security", cost: 12000 },
    { id: "mpesa_fintech", label: "M-Pesa Daraja & Bank Integration", cost: 18000 },
    { id: "pdf_reporting", label: "Automated PDF Invoices & Reports", cost: 10000 },
    { id: "qr_barcode", label: "QR / Barcode Scanning & Gen", cost: 8000 },
    { id: "sms_whatsapp", label: "Bulk SMS & WhatsApp Bot Integration", cost: 14000 },
    { id: "realtime_chat", label: "Real-time Chat & WebSockets", cost: 16000 },
  ];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculate estimated cost & time
  const currentType = projectTypesList.find((t) => t.id === projectType) || projectTypesList[0];
  const platformsCost = selectedPlatforms.reduce((acc, pid) => {
    const p = platformsList.find((item) => item.id === pid);
    return acc + (p ? p.cost : 0);
  }, 0);
  const featuresCost = selectedFeatures.reduce((acc, fid) => {
    const f = featuresList.find((item) => item.id === fid);
    return acc + (f ? f.cost : 0);
  }, 0);

  const speedMultiplier = timelineSpeed === "express" ? 1.25 : timelineSpeed === "relaxed" ? 0.95 : 1.0;
  const rawMin = Math.round((currentType.baseCost + platformsCost + featuresCost) * speedMultiplier);
  const rawMax = Math.round(rawMin * 1.35);

  const estimatedWeeks = Math.max(
    2,
    Math.round((currentType.baseWeeks + selectedPlatforms.length * 0.8 + selectedFeatures.length * 0.5) * (timelineSpeed === "express" ? 0.75 : 1.0))
  );

  const handleSubmitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) return;

    setIsSubmitting(true);
    try {
      const estimateSummary = `[CUSTOM SOFTWARE ESTIMATE]\nType: ${currentType.label}\nPlatforms: ${selectedPlatforms.join(", ")}\nFeatures: ${selectedFeatures.join(", ")}\nSpeed: ${timelineSpeed}\nEst. Budget: KES ${rawMin.toLocaleString()} - ${rawMax.toLocaleString()} (~${estimatedWeeks} weeks)\nNotes: ${projectNotes}`;

      const inquiry: PublicInquiry = {
        id: `est_${Date.now()}`,
        tenantId: "davetech_main",
        fullName: contactName,
        email: contactEmail,
        phone: contactPhone,
        programInterestedIn: `Custom Software: ${currentType.label}`,
        message: estimateSummary,
        status: "new",
        createdAt: new Date().toISOString(),
      };

      await savePublicInquiry(inquiry);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error("Error submitting estimate:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  DAVETECH Custom Software Quotation & Scope Estimator
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Instant Calculator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure your project architecture, target platforms, and integrations for instant budget & timeline estimates.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-white space-y-6">
          {submittedSuccess ? (
            <div className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto bg-purple-950/20 border border-purple-500/30 rounded-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">Project Specification Received!</h4>
              <p className="text-sm text-slate-300">
                Thank you, <span className="font-semibold text-white">{contactName}</span>. Our lead software architect will review your technical requirements and contact you via <span className="text-purple-300 font-mono">{contactPhone}</span> and <span className="text-purple-300 font-mono">{contactEmail}</span> within 4 business hours to schedule a deep-dive scoping call.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-400 border border-slate-800">
                Estimated Project Scope: <span className="text-white font-bold">{currentType.label}</span> • Estimated Timeline: <span className="text-purple-400 font-bold">~{estimatedWeeks} Weeks</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Options (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Project Type */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 block">
                    1. Select Core System Archetype
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {projectTypesList.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id)}
                        className={`p-3 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                          projectType === type.id
                            ? "bg-purple-950/60 border-purple-500 text-white font-bold shadow-xs"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                        }`}
                      >
                        <span>{type.label}</span>
                        {projectType === type.id && (
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Platforms */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 block">
                    2. Target Deployment Platforms (Multiple)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {platformsList.map((plat) => {
                      const isSelected = selectedPlatforms.includes(plat.id);
                      return (
                        <button
                          key={plat.id}
                          type="button"
                          onClick={() => togglePlatform(plat.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                            isSelected
                              ? "bg-purple-950/50 border-purple-500 text-white font-semibold"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="truncate">{plat.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? "bg-purple-500 border-purple-500 text-slate-950 font-bold"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Core Capabilities & Integrations */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 block">
                    3. Integrations & Advanced Capabilities
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featuresList.map((feat) => {
                      const isSelected = selectedFeatures.includes(feat.id);
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          onClick={() => toggleFeature(feat.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                            isSelected
                              ? "bg-purple-950/50 border-purple-500 text-white font-semibold"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="truncate">{feat.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? "bg-purple-500 border-purple-500 text-slate-950 font-bold"
                                : "border-slate-600"
                            }`}
                          >
                            {isSelected && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Timeline Speed */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 block">
                    4. Desired Development Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "relaxed", label: "Flexible Phase", badge: "Cost Optimized" },
                      { id: "standard", label: "Standard Sprint", badge: "Recommended" },
                      { id: "express", label: "Express MVP", badge: "Fast Launch" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTimelineSpeed(s.id)}
                        className={`p-2 rounded-xl text-center border text-xs transition-all ${
                          timelineSpeed === s.id
                            ? "bg-purple-600 text-white font-bold border-purple-400 shadow-xs"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div>{s.label}</div>
                        <div className="text-[9px] opacity-75 font-normal">{s.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Estimate & Instant Submission (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-extrabold tracking-wider uppercase text-purple-400 flex items-center gap-1.5 pb-3 border-b border-slate-800">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Live Architecture Estimation</span>
                  </div>

                  {/* Price Range Card */}
                  <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 rounded-xl p-4 my-3 text-center">
                    <div className="text-[11px] text-slate-400 font-medium">Estimated Budget Range</div>
                    <div className="text-2xl font-black text-white mt-1">
                      KES {rawMin.toLocaleString()} - {rawMax.toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-300 mt-0.5 font-mono">
                      (~${Math.round(rawMin / 130).toLocaleString()} - ${Math.round(rawMax / 130).toLocaleString()} USD)
                    </div>

                    <div className="mt-3 pt-3 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-left text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Estimated Timeline</span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          ~{estimatedWeeks} Weeks
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Cloud SLA Uptime</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          99.98% Cloud SLA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleSubmitEstimate} className="space-y-2.5 text-xs">
                    <div className="text-xs font-bold text-slate-300">
                      Request Technical Consultation & NDA:
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Full Name *"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Phone / WhatsApp *"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={projectNotes}
                        onChange={(e) => setProjectNotes(e.target.value)}
                        placeholder="Brief summary of your project vision (optional)..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting Specification...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Specification for Review</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
