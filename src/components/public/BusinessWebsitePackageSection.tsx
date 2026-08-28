import React, { useState } from "react";
import { DAVETECH_PACKAGES } from "../../data/packagesData";
import {
  Globe,
  Gauge,
  LayoutTemplate,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Laptop,
  Briefcase,
  Stethoscope,
  Building,
  Utensils,
  Code2,
} from "lucide-react";

export const BusinessWebsitePackageSection: React.FC = () => {
  const [activeTemplateTab, setActiveTemplateTab] = useState<string>("corporate");

  const pkg = DAVETECH_PACKAGES.find((p) => p.id === "business_website")!;

  const templates = [
    {
      id: "corporate",
      name: "Corporate & Enterprise",
      icon: Briefcase,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      description: "Polished corporate presence for financial firms, consultancies, holding companies and logistics.",
      features: ["Executive Leadership CMS", "Annual Report Downloads", "Investor Relations", "Branch Locator Map"],
    },
    {
      id: "medical",
      name: "Healthcare & Clinics",
      icon: Stethoscope,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
      description: "Trust-building websites for hospitals, specialist clinics, diagnostic labs and dental practices.",
      features: ["Doctor Appointment Booking", "Department Showcases", "Patient Portal Link", "Emergency Hotlines"],
    },
    {
      id: "law",
      name: "Legal & Advisory",
      icon: Building,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
      description: "Authoritative digital firm profiles for advocates, arbiters, auditors and tax specialists.",
      features: ["Legal Insights Blog", "Practice Area Guides", "Partner Directory", "Confidential Case Inquiry"],
    },
    {
      id: "hospitality",
      name: "Hotels & Restaurants",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      description: "Vibrant showcase sites for boutique resorts, city hotels, safari camps, cafes and dining spots.",
      features: ["Room & Table Reservations", "Interactive Food Menu", "Virtual Photo Gallery", "M-Pesa Booking Deposit"],
    },
  ];

  const currentTemplate = templates.find((t) => t.id === activeTemplateTab) || templates[0];

  return (
    <section id="business-website-section" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
              <Globe className="w-4 h-4" />
              <span>PACKAGE 3: DIGITAL BRANDING & CMS WEBSITES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              High-Converting Business Websites & CMS
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Transform your enterprise identity with sub-second loading speeds, zero-code content management, automated SSL certificates, and direct WhatsApp lead generation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact-quote"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Your Business Website</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pkg.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                {feat.icon === "Gauge" && <Gauge className="w-6 h-6" />}
                {feat.icon === "LayoutTemplate" && <LayoutTemplate className="w-6 h-6" />}
                {feat.icon === "MessageSquare" && <MessageSquare className="w-6 h-6" />}
                {feat.icon === "Globe" && <Globe className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Industry Template Showcase */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Explore Modern Website Archetypes</h3>
              <p className="text-xs text-slate-400">Tailored structure, copywriting tone, and conversion modules per industry.</p>
            </div>

            {/* Template Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = activeTemplateTab === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setActiveTemplateTab(tpl.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-sky-500 text-slate-950 shadow-md font-black"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Template Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                {currentTemplate.name} Edition
              </div>
              <h4 className="text-2xl font-black text-white">{currentTemplate.description}</h4>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-300">Included Conversion Modules:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentTemplate.features.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Free SSL Certificate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>100% Mobile Responsive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-sky-400" />
                  <span>Google SEO Optimized</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                <img
                  src={currentTemplate.image}
                  alt={currentTemplate.name}
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{currentTemplate.name} Live Demo Layout</div>
                    <div className="text-[10px] text-slate-400 font-mono">Custom Subdomain + Custom Domain DNS</div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    99+ PageSpeed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
