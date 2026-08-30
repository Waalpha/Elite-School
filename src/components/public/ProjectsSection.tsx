import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ProjectsSectionProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
}) => {
  const { setViewMode } = useTenant();

  const projects = [
    {
      id: "project_erp",
      category: "Education Cloud",
      title: "DAVETECH School ERP",
      subtitle: "Multi-Campus Academic & CBC Management Platform",
      description:
        "An institutional operating system engineered for Kenyan primary, junior secondary, and TVET institutions. Features automated CBC report card generation, M-Pesa fee reconciliation, teacher grading rubrics, and QR-code student attendance tracking.",
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      capabilities: [
        { label: "Curriculum", value: "CBC, 8-4-4 & TVET" },
        { label: "Fee Gateway", value: "M-Pesa STK Auto-Push" },
        { label: "Attendance", value: "QR Code Verification" },
      ],
      tags: ["CBC Grading Engine", "M-Pesa Fee API", "QR Attendance", "Parent Portal"],
      actionLabel: "Launch Live ERP Demo",
      onAction: () => setViewMode("erp"),
    },
    {
      id: "project_pos",
      category: "Retail & FinTech",
      title: "DAVETECH POS & Retail Cloud",
      subtitle: "High-Speed Point of Sale & Inventory Terminal",
      description:
        "A lightning-fast point-of-sale system engineered for supermarkets, retail shops, wholesale depots, and restaurant counters. Features instant barcode scanning, direct M-Pesa STK push receipting, batch stock tracking, and end-of-day cashier Z-reports.",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=1200&auto=format&fit=crop&q=80",
      capabilities: [
        { label: "Barcode Scanning", value: "Instant USB / Bluetooth" },
        { label: "M-Pesa Integration", value: "Direct STK Prompt" },
        { label: "Hardware Support", value: "Thermal 58mm / 80mm" },
      ],
      tags: ["Barcode Scanner", "M-Pesa Till Push", "Inventory Alerts", "Z-Reports"],
      actionLabel: "Try POS Simulator",
      onAction: onOpenPosModal,
    },
    {
      id: "project_websites",
      category: "Web Engineering",
      title: "Corporate & Institutional Websites",
      subtitle: "High-Speed Conversion Portals & Digital Brands",
      description:
        "Modern corporate web platforms engineered for Kenyan businesses, schools, and professional service firms. Built with mobile-first UX, blazing fast PageSpeed optimization, custom domains, SSL encryption, and integrated lead capture forms.",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
      capabilities: [
        { label: "PageSpeed Score", value: "98/100 Mobile & Desktop" },
        { label: "Security & Hosting", value: "Free SSL & Fast CDN" },
        { label: "Search Engine", value: "Google SEO Optimized" },
      ],
      tags: ["Modern UI Design", "SEO Engine", "Lead Capture", "Fast Cloud Hosting"],
      actionLabel: "Get a Free Website Quote",
      onAction: () => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "project_custom",
      category: "Custom Systems",
      title: "Custom Enterprise Systems",
      subtitle: "Tailored Cloud Software & Automated Workflows",
      description:
        "Bespoke software architecture engineered for unique organizational workflows. Including supply chain inventory trackers, transport & logistics dispatch portals, member directory databases, and customized billing engines.",
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80",
      capabilities: [
        { label: "Architecture", value: "Custom Cloud APIs" },
        { label: "User Access", value: "Role-Based Permissions" },
        { label: "Engineering", value: "Dedicated Local Support" },
      ],
      tags: ["Custom Workflows", "API Integrations", "Role-Based Access", "Dedicated SLA"],
      actionLabel: "Calculate Custom Project Quote",
      onAction: onOpenEstimatorModal,
    },
  ];

  return (
    <section id="projects" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span>PROJECTS & SYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-black tracking-tight text-slate-900 leading-tight">
              Technology We've Built
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore our core software systems and digital platforms actively powering schools, retail businesses, and organizations across Kenya.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4 Detailed Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Banner */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-sm backdrop-blur-md">
                      {proj.category}
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug drop-shadow-sm">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-200 font-medium line-clamp-1">
                      {proj.subtitle}
                    </p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7 space-y-5">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Architectural Capabilities Box */}
                  <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center">
                    {proj.capabilities.map((cap, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="text-[10px] text-slate-500 font-medium">{cap.label}</div>
                        <div className="text-xs font-bold text-slate-900">{cap.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={proj.onAction}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer group-hover:bg-indigo-600"
                >
                  <span>{proj.actionLabel}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
