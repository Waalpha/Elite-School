import React from "react";
import { CASE_STUDIES } from "../../data/packagesData";
import { Star, Quote, CheckCircle2, TrendingUp, MapPin, Building2 } from "lucide-react";

export const TestimonialsAndCaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="py-16 sm:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
            <span>PROVEN REAL-WORLD IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Client Success Stories & Enterprise Deployments
          </h2>
          <p className="text-sm text-slate-300">
            Trusted by schools, supermarkets, corporate legal practices, and regional logistics providers across East Africa.
          </p>
        </div>

        {/* 4 Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      {study.package}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{study.client}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{study.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  &ldquo;{study.quote}&rdquo;
                </p>

                {/* Outcome Metrics */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Verified Outcomes:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {study.metrics.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{m}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{study.author}</div>
                  <div className="text-slate-400 text-[11px]">{study.role}</div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Verified Case Study</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
