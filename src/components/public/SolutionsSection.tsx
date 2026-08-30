import React from "react";
import { useTenant } from "../../context/TenantContext";
import {
  GraduationCap,
  Store,
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface SolutionsSectionProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
}) => {
  const { setViewMode } = useTenant();

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const solutions = [
    {
      id: "school_erp",
      icon: GraduationCap,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "School ERP",
      description:
        "Manage students, fees, attendance, academics, staff and school operations from one powerful platform.",
      highlights: [
        "CBC, 8-4-4 & TVET Grading Engines",
        "Automated Fee Invoicing & M-Pesa Receipts",
        "Parent SMS Alerts & Student Portals",
        "QR Code Attendance Verification",
      ],
      actionText: "Learn More",
      onAction: () => setViewMode("erp"),
      badge: "Flagship Cloud",
    },
    {
      id: "pos_system",
      icon: Store,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "POS Systems",
      description:
        "Simple and reliable point-of-sale systems for shops, hotels, restaurants and businesses.",
      highlights: [
        "High-Speed Barcode Scanning",
        "Direct M-Pesa STK Push & Till Integration",
        "Real-Time Stock & Low-Inventory Alerts",
        "Multi-Branch & Cashier Z-Reports",
      ],
      actionText: "Try Simulator",
      onAction: onOpenPosModal,
      badge: "Instant Register",
    },
    {
      id: "business_website",
      icon: Globe,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      title: "Professional Websites",
      description:
        "Modern, fast and conversion-focused websites designed to make your business stand out.",
      highlights: [
        "High-Speed 98+ PageSpeed Optimization",
        "Custom Domain, SSL Certificate & Hosting",
        "Search Engine Optimization (SEO)",
        "Integrated Lead Capture Forms",
      ],
      actionText: "View Packages",
      onAction: () => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
      badge: "High Converting",
    },
    {
      id: "custom_software",
      icon: Cpu,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      title: "Custom Software",
      description:
        "Software tailored to your exact workflow, business needs and growth.",
      highlights: [
        "Bespoke Cloud Web & Mobile Applications",
        "FinTech & Payment Gateway Integrations",
        "Automated Business Process Workflows",
        "Dedicated Kenyan Engineering Support",
      ],
      actionText: "Calculate Quote",
      onAction: onOpenEstimatorModal,
      badge: "Bespoke Engineering",
    },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <span>CORE CAPABILITIES</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-black tracking-tight text-slate-900 leading-tight">
            Solutions Built Around Your Business
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From comprehensive educational cloud platforms to high-speed retail registers and bespoke web software, DAVETECH engineers software that drives real measurable performance.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl border ${item.iconBg} ${item.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 pt-1">
                    {item.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm text-slate-600 leading-relaxed min-h-[48px]">
                    {item.description}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={item.onAction}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all cursor-pointer group-hover:bg-indigo-50/70"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
