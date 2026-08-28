import React from "react";
import { Check, X, ArrowRight, Layers, Store, Globe, Cpu } from "lucide-react";

interface PackagesComparisonTableProps {
  onOpenPosModal: () => void;
  onOpenEstimatorModal: () => void;
  onLaunchERP: () => void;
}

export const PackagesComparisonTable: React.FC<PackagesComparisonTableProps> = ({
  onOpenPosModal,
  onOpenEstimatorModal,
  onLaunchERP,
}) => {
  const comparisonRows = [
    {
      feature: "Target Industry",
      erp: "Schools, TVET & Colleges",
      pos: "Retail, Wholesale & Supermarkets",
      web: "Corporate, Clinics & Agencies",
      custom: "Scale-ups, FinTech & Enterprise",
    },
    {
      feature: "Core Architecture",
      erp: "Multi-Tenant Cloud OS",
      pos: "High-Speed POS & Inventory",
      web: "Modern Jamstack & CMS",
      custom: "Bespoke Mobile/Web/Cloud",
    },
    {
      feature: "M-Pesa STK Integration",
      erp: "Automatic Fee Reconciliation",
      pos: "Instant STK Cashier Prompt",
      web: "Lead & Deposit Checkout",
      custom: "Full Daraja 3.0 API Suite",
    },
    {
      feature: "Multi-Branch / Multi-Campus",
      erp: "Yes (Multi-Campus Sync)",
      pos: "Yes (Multi-Store Inventory)",
      web: "Multi-Location Pages",
      custom: "Distributed Cloud Architecture",
    },
    {
      feature: "Hardware Compatibility",
      erp: "QR Scanners & ID Printers",
      pos: "Sunmi, POS Registers, Thermal 80mm",
      web: "All Web & Mobile Browsers",
      custom: "Custom Hardware & IoT / GPS",
    },
    {
      feature: "Custom Subdomain & Domain",
      erp: "Included (school.davetecherp.com)",
      pos: "Included (store.davetechpos.com)",
      web: "Custom .co.ke / .com + Free SSL",
      custom: "Dedicated Cloud Ingress / VPC",
    },
    {
      feature: "Typical Deployment Time",
      erp: "Instant (1-2 Days Onboarding)",
      pos: "Same Day (1 Day Setup)",
      web: "3-5 Business Days",
      custom: "2-6 Weeks (Sprint Milestones)",
    },
    {
      feature: "Ongoing SLA & Backups",
      erp: "99.98% Cloud SLA + Daily DB Backup",
      pos: "99.98% Cloud SLA + Daily DB Backup",
      web: "Global CDN + 100% Uptime SSL",
      custom: "Dedicated SLA & Source Code",
    },
  ];

  return (
    <section id="comparison-matrix" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <span>PACKAGES AT A GLANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Compare Our 4 Technology Solutions
          </h2>
          <p className="text-sm text-slate-400">
            Transparent breakdown of capabilities, deployment timeframes, and hardware compatibility.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90">
                <th className="p-4 sm:p-5 text-slate-400 font-bold uppercase tracking-wider text-[11px] w-1/4">
                  Feature / Capability
                </th>
                <th className="p-4 sm:p-5 text-white font-extrabold w-[18.75%] bg-indigo-950/40 border-l border-indigo-900/50">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Layers className="w-4 h-4" />
                    <span>1. School ERP</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">From KES 18,500/term</div>
                </th>
                <th className="p-4 sm:p-5 text-white font-extrabold w-[18.75%] bg-emerald-950/40 border-l border-emerald-900/50">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Store className="w-4 h-4" />
                    <span>2. POS System</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">From KES 14,000 one-time</div>
                </th>
                <th className="p-4 sm:p-5 text-white font-extrabold w-[18.75%] bg-sky-950/40 border-l border-sky-900/50">
                  <div className="flex items-center gap-2 text-sky-300">
                    <Globe className="w-4 h-4" />
                    <span>3. Business Web</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">From KES 24,500 setup</div>
                </th>
                <th className="p-4 sm:p-5 text-white font-extrabold w-[18.75%] bg-purple-950/40 border-l border-purple-900/50">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Cpu className="w-4 h-4" />
                    <span>4. Custom Software</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">Bespoke Scope</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 sm:p-4.5 font-bold text-slate-300">{row.feature}</td>
                  <td className="p-4 sm:p-4.5 text-slate-200 bg-indigo-950/20 border-l border-indigo-900/30 font-medium">
                    {row.erp}
                  </td>
                  <td className="p-4 sm:p-4.5 text-slate-200 bg-emerald-950/20 border-l border-emerald-900/30 font-medium">
                    {row.pos}
                  </td>
                  <td className="p-4 sm:p-4.5 text-slate-200 bg-sky-950/20 border-l border-sky-900/30 font-medium">
                    {row.web}
                  </td>
                  <td className="p-4 sm:p-4.5 text-slate-200 bg-purple-950/20 border-l border-purple-900/30 font-medium">
                    {row.custom}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-800 bg-slate-900/60">
                <td className="p-4 text-xs font-bold text-slate-400">Interactive Action</td>
                <td className="p-4 bg-indigo-950/40 border-l border-indigo-900/50">
                  <button
                    type="button"
                    onClick={onLaunchERP}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Launch ERP
                  </button>
                </td>
                <td className="p-4 bg-emerald-950/40 border-l border-emerald-900/50">
                  <button
                    type="button"
                    onClick={onOpenPosModal}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Try POS
                  </button>
                </td>
                <td className="p-4 bg-sky-950/40 border-l border-sky-900/50">
                  <a
                    href="#contact-quote"
                    className="w-full block text-center py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Order Web
                  </a>
                </td>
                <td className="p-4 bg-purple-950/40 border-l border-purple-900/50">
                  <button
                    type="button"
                    onClick={onOpenEstimatorModal}
                    className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Estimate
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};
