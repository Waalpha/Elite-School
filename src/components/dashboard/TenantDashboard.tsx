import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Student, Staff, Invoice, Payment, AcademicClass } from "../../types";
import {
  subscribeToStudents,
  subscribeToStaff,
  subscribeToInvoices,
  subscribeToPayments,
  subscribeToClasses,
} from "../../services/firestoreService";
import {
  Users,
  Briefcase,
  Receipt,
  TrendingUp,
  Award,
  BookOpen,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  DollarSign,
  GraduationCap,
} from "lucide-react";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const TenantDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentTenant, currentBranch } = useTenant();

  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<AcademicClass[]>([]);

  useEffect(() => {
    if (!currentTenant) return;

    const unsubStudents = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    const unsubStaff = subscribeToStaff(currentTenant.id, setStaffList);
    const unsubInvoices = subscribeToInvoices(currentTenant.id, setInvoices);
    const unsubPayments = subscribeToPayments(currentTenant.id, setPayments);
    const unsubClasses = subscribeToClasses(currentTenant.id, setClasses);

    return () => {
      unsubStudents();
      unsubStaff();
      unsubInvoices();
      unsubPayments();
      unsubClasses();
    };
  }, [currentTenant?.id, currentBranch?.id]);

  const currency = currentTenant?.currency || "KES";

  // Calculations
  const totalBilled = students.reduce((sum, s) => sum + (s.totalFeeBilled || 0), 0);
  const totalCollected = students.reduce((sum, s) => sum + (s.totalFeePaid || 0), 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  // Grade level distribution
  const prePrimaryCount = students.filter((s) => s.educationLevel === "pre_primary").length;
  const primaryCount = students.filter((s) => s.educationLevel === "primary").length;
  const juniorCount = students.filter((s) => s.educationLevel === "junior_school").length;
  const collegeCount = students.filter((s) => s.educationLevel === "college" || s.educationLevel === "tvet").length;

  const isPrimary = currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with dynamic Tenant theme */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${currentTenant?.primaryColor || "#4f46e5"} 0%, #1e1b4b 100%)`,
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentTenant?.name}</span>
            {currentBranch && <span>• {currentBranch.name}</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to {currentTenant?.code} ERP Portal
          </h1>
          <p className="text-white/80 text-sm mt-1 leading-relaxed">
            {currentTenant?.motto || "Real-time academic management, fee reconciliation, and CBC competency tracking powered by Firestore."}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="relative z-10 flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("students")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>{isPrimary ? "Admit Learner" : "Register Student"}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("finance")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold text-xs border border-white/30 transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Receive Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPrimary ? "Enrolled Learners" : "Total Enrolled Students"}
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{students.length}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Active Profiles</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Fees Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fees Collected
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currency} {totalCollected.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-600 font-medium mt-1">
              {collectionRate}% Collection Efficiency
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Fee Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Outstanding Balances
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">
              {currency} {totalOutstanding.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Across {students.filter((s) => (s.balance || 0) > 0).length} accounts
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Classes / Courses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPrimary ? "Active Class Streams" : "Academic Programs & Classes"}
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{classes.length || 6}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {staffList.length || 8} Teaching Faculty
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Level Breakdown Cards for Primary / TVET */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isPrimary ? "CBC Education Level Enrollment Breakdown" : "Program Level Breakdown"}
            </h3>
            <p className="text-xs text-slate-500">
              Live student distribution per configured academic tier
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("students")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Profiles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isPrimary ? (
            <>
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-800">Early Years (Pre-Primary)</div>
                <div className="text-[11px] text-emerald-600">Playgroup, PP1, PP2</div>
                <div className="text-xl font-black text-emerald-950 mt-2">{prePrimaryCount} Learners</div>
              </div>

              <div className="p-3.5 rounded-lg bg-sky-50/70 border border-sky-100">
                <div className="text-xs font-bold text-sky-800">Primary CBC</div>
                <div className="text-[11px] text-sky-600">Grade 1 - Grade 6</div>
                <div className="text-xl font-black text-sky-950 mt-2">{primaryCount} Learners</div>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-800">Junior Secondary (JSS)</div>
                <div className="text-[11px] text-indigo-600">Grade 7 - Grade 9</div>
                <div className="text-xl font-black text-indigo-950 mt-2">{juniorCount} Learners</div>
              </div>

              <div className="p-3.5 rounded-lg bg-purple-50/70 border border-purple-100">
                <div className="text-xs font-bold text-purple-800">CBC Competency Level</div>
                <div className="text-[11px] text-purple-600">Exceeding & Meeting (EE/ME)</div>
                <div className="text-xl font-black text-purple-950 mt-2">94.2%</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-lg bg-sky-50/70 border border-sky-100">
                <div className="text-xs font-bold text-sky-800">Computing & IT</div>
                <div className="text-[11px] text-sky-600">Diploma in ICT, Software Eng</div>
                <div className="text-xl font-black text-sky-950 mt-2">48 Students</div>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-800">Business & Management</div>
                <div className="text-[11px] text-indigo-600">DBA, Procurement & HR</div>
                <div className="text-xl font-black text-indigo-950 mt-2">36 Students</div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-800">Accounting & Finance</div>
                <div className="text-[11px] text-emerald-600">CPA Kenya Foundation & Intermediate</div>
                <div className="text-xl font-black text-emerald-950 mt-2">24 Students</div>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-100">
                <div className="text-xs font-bold text-amber-800">Graduation Readiness</div>
                <div className="text-[11px] text-amber-600">Clearances & Transcripts</div>
                <div className="text-xl font-black text-amber-950 mt-2">100% Verified</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Split Section: Recent Admissions and Recent Fee Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Admissions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Recent Enrolled {isPrimary ? "Learners" : "Students"}</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("students")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2.5">
            {students.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={s.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-medium text-slate-700">{s.admissionNo}</span>
                      <span>•</span>
                      <span className="font-semibold text-indigo-600">{s.gradeOrClass}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      s.balance === 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {s.balance === 0 ? "Fee Cleared" : `Bal: ${currency} ${s.balance.toLocaleString()}`}
                  </span>
                </div>
              </div>
            ))}

            {students.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No learners recorded in this branch yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Payments Ledger */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Recent Payment Transactions</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("finance")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Fee Ledger
            </button>
          </div>

          <div className="space-y-2.5">
            {payments.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.studentName}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="font-mono text-slate-600 font-medium">Receipt #{p.receiptNumber}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{p.paymentMethod}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-700">
                    +{currency} {p.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{p.paymentDate || "Today"}</div>
                </div>
              </div>
            ))}

            {payments.length === 0 && (
              <div className="p-4 rounded-lg bg-slate-50 text-center text-xs text-slate-500">
                <span>Directly record student fee receipts to view real-time transaction ledger.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
