import React, { useState } from "react";
import { savePublicInquiry } from "../../services/firestoreService";
import type { PublicInquiry } from "../../types";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Building2,
  Sparkles,
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("School ERP");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) return;

    setIsSubmitting(true);
    try {
      const inquiry: PublicInquiry = {
        id: `inq_${Date.now()}`,
        tenantId: "davetech_main",
        fullName,
        phone,
        email,
        programInterestedIn: serviceNeeded,
        message: `[SERVICE INQUIRY]\nService: ${serviceNeeded}\nDetails: ${message || "General inquiry"}`,
        status: "new",
        createdAt: new Date().toISOString(),
      };

      await savePublicInquiry(inquiry);
      setIsSubmitted(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Contact Information */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                <span>GET IN TOUCH</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Let's Discuss Your Project
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Contact DAVETECH today for system demonstrations, technical consultations, or custom software proposals. Our team is ready to assist your institution or enterprise.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              
              {/* Location Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</div>
                  <div className="text-base font-bold text-slate-900">DAVETECH Solutions</div>
                  <div className="text-sm text-slate-600">Thika, Kenya</div>
                </div>
              </div>

              {/* Phone Numbers Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Numbers</div>
                  <div className="flex flex-wrap items-center gap-3 mt-0.5">
                    <a
                      href="tel:0707760239"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 font-mono transition-colors"
                    >
                      0707760239
                    </a>
                    <span className="text-slate-300">/</span>
                    <a
                      href="tel:0719176549"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 font-mono transition-colors"
                    >
                      0719176549
                    </a>
                  </div>
                  <div className="mt-2">
                    <a
                      href="https://wa.me/254707760239?text=Hello%20DAVETECH%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat directly on WhatsApp (0707760239)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</div>
                  <a
                    href="mailto:support@davetech.co.ke"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 font-mono transition-colors block mt-0.5"
                  >
                    support@davetech.co.ke
                  </a>
                  <div className="text-xs text-slate-500 mt-1">Prompt responses within 2 business hours</div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Clean Inquiry Form */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs">
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for contacting DAVETECH. A software consultant will contact you via phone or email shortly with full details and pricing.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the form below and our engineering team will get back to you promptly.
                    </p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>

                  {/* Phone & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0707760239"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. david@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Service Needed Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service Needed *
                    </label>
                    <select
                      value={serviceNeeded}
                      onChange={(e) => setServiceNeeded(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs"
                    >
                      <option value="School ERP">School ERP / Education Management System</option>
                      <option value="POS Systems">POS Systems (Point of Sale & Retail)</option>
                      <option value="Professional Websites">Professional Business Website</option>
                      <option value="Custom Software">Custom Software Development</option>
                      <option value="Cloud Solutions & Other">Cloud Solutions & Other Inquiries</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Message / Project Details
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your organization, current challenges, or specific software requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
