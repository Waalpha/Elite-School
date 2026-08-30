import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  PhoneCall,
  CheckCircle2,
  Building,
  Lock,
  Headphones,
} from "lucide-react";

export const WhyDavetechSection: React.FC = () => {
  const features = [
    {
      id: "built_for_business",
      icon: Sparkles,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Built for Your Business",
      description:
        "We don't sell bloated generic templates. Every system is built to eliminate operational bottlenecks, streamline day-to-day workflow, and directly boost business revenue.",
    },
    {
      id: "cloud_and_secure",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Cloud-Based & Secure",
      description:
        "Access your system securely from anywhere in Kenya on mobile, tablet, or desktop. Protected by bank-grade encryption, automated backups, and 99.98% uptime.",
    },
    {
      id: "simple_to_use",
      icon: Zap,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Simple to Use",
      description:
        "Clean, intuitive user interfaces designed so your cashiers, teachers, accountants, or administrators can master the software in minutes with zero steep learning curves.",
    },
    {
      id: "local_support",
      icon: Headphones,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      title: "Local Support in Kenya",
      description:
        "Direct access to our dedicated engineering team based in Thika and Nairobi. Fast phone, WhatsApp, and on-site support whenever you need assistance.",
    },
  ];

  return (
    <section id="why-davetech" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <span>THE DAVETECH ADVANTAGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-black tracking-tight text-slate-900 leading-tight">
            Why Businesses Choose DAVETECH
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            We partner with Kenyan schools, retailers, and growing enterprises to deliver reliable, high-performance technology backed by responsive local support.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl border ${feat.iconBg} ${feat.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed Standards</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
