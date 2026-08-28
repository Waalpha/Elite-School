import React, { useState } from "react";
import { savePublicInquiry } from "../../services/firestoreService";
import { useTenant } from "../../context/TenantContext";
import type { PublicInquiry, SoftwarePackageId } from "../../types";
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Store,
  Globe,
  Cpu,
  Layers,
  Clock,
  Building,
} from "lucide-react";

export const ConsultationQuoteForm: React.FC = () => {
  const { platformConfig } = useTenant();

  const [selectedPackage, setSelectedPackage] = useState<string>("all_bundle");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [timeline, setTimeline] = useState("Immediate (1-2 Weeks)");
  const [estimatedScale, setEstimatedScale] = useState("Medium Scale");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const packagesOptions = [
    { id: "school_erp", label: "School ERP Cloud", icon: GraduationCap },
    { id: "pos_system", label: "POS & Retail System", icon: Store },
    { id: "business_website", label: "Business Website & CMS", icon: Globe },
    { id: "custom_software", label: "Custom Software Development", icon: Cpu },
    { id: "all_bundle", label: "All-in-One Enterprise Suite", icon: Layers },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);
    try {
      const pkgLabel = packagesOptions.find((p) => p.id === selectedPackage)?.label || selectedPackage;
      const fullDetails = `[INQUIRY & QUOTE REQUEST]\nPackage: ${pkgLabel}\nOrganization: ${organizationName || "N/A"}\nTimeline: ${timeline}\nScale: ${estimatedScale}\nRequirements: ${message || "General consultation requested."}`;

      const inquiry: PublicInquiry = {
        id: `quote_${Date.now()}`,
        tenantId: "davetech_main",
        fullName,
        email,
        phone,
        programInterestedIn: `${pkgLabel} (${organizationName || "Direct Inquiry"})`,
        message: fullDetails,
        status: "new",
        createdAt: new Date().toISOString(),
      };

      await savePublicInquiry(inquiry);
      setIsSubmitted(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setOrganizationName("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting quote inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-quote" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact info & value prop (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>DIRECT ONBOARDING & CONSULTATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Request a Custom Quote or Live Institutional Demo
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you need to deploy our School ERP for next term, upgrade your supermarket checkout with POS, launch a fast corporate website, or engineer custom cloud software, our team is ready to assist.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Direct Telephone & WhatsApp</div>
                  <a
                    href={`tel:${platformConfig.supportPhone || "+254700000000"}`}
                    className="text-sm font-bold text-white hover:text-emerald-400 font-mono transition-colors"
                  >
                    {platformConfig.supportPhone || "+254 700 000 000"}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Direct Email Inquiries</div>
                  <a
                    href={`mailto:${platformConfig.supportEmail || "davmuchiri48@gmail.com"}`}
                    className="text-sm font-bold text-white hover:text-indigo-400 font-mono transition-colors"
                  >
                    {platformConfig.supportEmail || "davmuchiri48@gmail.com"}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Headquarters</div>
                  <div className="text-sm font-bold text-white">
                    {platformConfig.address || "Nairobi, Kenya • East Africa Tech Hub"}
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Trust Note */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>We guarantee same-day technical consultation and a formal NDA for all custom software proposals.</span>
            </div>
          </div>

          {/* Right Column: Submission Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Inquiry Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out to <span className="font-bold text-white">{platformConfig.brandName}</span>. Our technical solutions team has logged your inquiry in our central cloud desk and will reach out via telephone/email within 2 to 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block">
                    1. Select Package of Interest
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {packagesOptions.map((pkg) => {
                      const Icon = pkg.icon;
                      const isSelected = selectedPackage === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPackage(pkg.id)}
                          className={`p-2.5 rounded-xl text-left border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-md"
                              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{pkg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Dave Muchiri"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Organization / School Name</label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Apex Supermarket / St. Austin Academy"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Phone Number / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Estimated Deployment Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option>Immediate (1-2 Weeks)</option>
                      <option>Next Month / Term</option>
                      <option>Within 3 Months</option>
                      <option>Planning / Budget Stage</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">Target Scope / Scale</label>
                    <select
                      value={estimatedScale}
                      onChange={(e) => setEstimatedScale(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option>Single Branch / Small School (&lt; 300 users)</option>
                      <option>Medium Institution (300 - 1,000 users)</option>
                      <option>Multi-Campus / Multi-Store Enterprise (1,000+ users)</option>
                      <option>Custom Engineering Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                    Describe Your Requirements & Goals (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide any specific requirements, current software pain points, or custom feature requests..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Inquiry to Davetech Cloud Desk...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request for Quotation & Demo</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
