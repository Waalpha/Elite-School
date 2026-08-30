import React from "react";
import { ArrowRight, MessageSquare, Phone, Sparkles } from "lucide-react";

export const CtaSection: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(99,102,241,0.2),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>START YOUR DIGITAL TRANSFORMATION</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Have a project in mind?
        </h2>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
          Let's build the right technology for your business.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          From full school ERP deployments and retail POS systems to high-speed corporate websites and custom cloud engineering, we are ready to bring your vision to life.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={scrollToContact}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer group"
          >
            <span>Talk to DAVETECH</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="https://wa.me/254707760239?text=Hello%20DAVETECH%2C%20I%20am%20inquiring%20about%20your%20software%20solutions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
