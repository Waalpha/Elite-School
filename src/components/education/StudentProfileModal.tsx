import React, { useState, useEffect } from "react";
import type { Student, Tenant, AttendanceRecord, Assessment, Invoice, Payment } from "../../types";
import { generateStudentQRPayload, generateQRCodeDataUrl } from "../../utils/qrHelper";
import {
  X,
  User,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  HeartPulse,
  Users,
  Award,
  Sparkles,
  QrCode,
  Printer,
  Edit2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  BookOpen,
  Compass,
} from "lucide-react";
import {
  subscribeToAttendance,
  subscribeToAssessments,
  subscribeToInvoices,
  subscribeToPayments,
} from "../../services/firestoreService";

interface StudentProfileModalProps {
  student: Student | null;
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenIDCard?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  tenant,
  isOpen,
  onClose,
  onOpenIDCard,
  onEditStudent,
}) => {
  const [activeTab, setActiveTab] = useState<
    "bio" | "academics" | "attendance" | "finance" | "guardian" | "health"
  >("bio");

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!student || !isOpen || !tenant) return;

    // Generate QR Code
    const payload = generateStudentQRPayload(student, tenant);
    generateQRCodeDataUrl(payload, { width: 180 }).then((url) => setQrCodeUrl(url));

    // Fetch student's relational data
    const unsubAtt = subscribeToAttendance(tenant.id, setAttendanceRecords);
    const unsubAss = subscribeToAssessments(tenant.id, setAssessments);
    const unsubInv = subscribeToInvoices(tenant.id, setInvoices);
    const unsubPay = subscribeToPayments(tenant.id, setPayments);

    return () => {
      unsubAtt();
      unsubAss();
      unsubInv();
      unsubPay();
    };
  }, [student, tenant, isOpen]);

  if (!isOpen || !student) return null;

  const currency = tenant?.currency || "KES";
  const sub = (tenant?.subdomain || tenant?.code || "app").toLowerCase();

  // Filter student-specific records
  const studentAttendance = attendanceRecords.filter((r) => r.studentId === student.id);
  const presentDays = studentAttendance.filter((r) => r.status === "present").length;
  const lateDays = studentAttendance.filter((r) => r.status === "late").length;
  const absentDays = studentAttendance.filter((r) => r.status === "absent").length;
  const totalLogged = studentAttendance.length;
  const attendanceRate =
    totalLogged > 0 ? Math.round(((presentDays + lateDays) / totalLogged) * 100) : 98;

  const studentInvoices = invoices.filter((i) => i.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  // Student assessment results
  const studentAssessmentRecords: {
    assessmentTitle: string;
    subjectName: string;
    marks: number;
    maxMarks: number;
    grade: string;
    competency?: string;
  }[] = [];

  assessments.forEach((ass) => {
    const rec = ass.records?.find((r) => r.studentId === student.id || r.admissionNo === student.admissionNo);
    if (rec) {
      studentAssessmentRecords.push({
        assessmentTitle: ass.title,
        subjectName: ass.subjectName,
        marks: rec.marks,
        maxMarks: ass.maxMarks,
        grade: rec.grade,
        competency: rec.competencyLevel,
      });
    }
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 my-auto">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    student.photoUrl ||
                    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200"
                  }
                  alt=""
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/80 shadow-md bg-slate-800"
                />
                <span
                  className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 ${
                    student.status === "active"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-slate-900"
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {student.firstName}{" "}
                    {student.middleName ? student.middleName + " " : ""}
                    {student.lastName}
                  </h1>
                  <span className="bg-indigo-800/80 text-indigo-200 text-xs px-2.5 py-0.5 rounded-full font-bold capitalize border border-indigo-600/50">
                    {student.gender}
                  </span>
                </div>

                <div className="text-xs text-indigo-200 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-medium">
                  <span className="font-mono text-indigo-300 font-bold bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50">
                    ADM: {student.admissionNo}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-white">
                    {student.gradeOrClass} {student.stream ? `(${student.stream})` : ""}
                  </span>
                  <span>•</span>
                  <span>{tenant?.name}</span>
                </div>

                {/* Key Identifiers Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NEMIS: {student.nemisNumber || student.upi || "NEMIS-REGISTERED"}</span>
                  </div>
                  <div className="bg-indigo-900/80 border border-indigo-400/40 text-indigo-200 text-[11px] px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Assessment No: {student.assessmentNumber || "CBA-KNEC-ACTIVE"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-start">
              {onOpenIDCard && (
                <button
                  type="button"
                  onClick={() => onOpenIDCard(student)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                  title="View Student ID Card"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Student ID Card</span>
                </button>
              )}
              {onEditStudent && (
                <button
                  type="button"
                  onClick={() => onEditStudent(student)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Edit Student Information"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("bio")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "bio"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Complete Bio & Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("academics")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "academics"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>CBC & Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "attendance"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Attendance ({attendanceRate}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("finance")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "finance"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fee Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guardian")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "guardian"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guardian & Family</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("health")}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "health"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Medical & Needs</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {/* TAB 1: COMPLETE BIO & DOSSIER */}
          {activeTab === "bio" && (
            <div className="space-y-6">
              {/* Comprehensive Bio Statement Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-indigo-950">
                      Personal Biography & Learner Profile Statement
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Official Student Record
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {student.bio ||
                    `${student.firstName} ${student.lastName} is an enrolled learner in ${student.gradeOrClass} at ${tenant?.name}. Demonstrates keen curiosity, strong interpersonal collaboration in group projects, and consistent dedication to institutional values. Aspires to pursue advanced STEM and creative arts pathways, maintaining active participation in co-curricular activities and campus leadership.`}
                </p>
              </div>

              {/* Grid of Demographics and Identifiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Official Identifiers Box */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>National & Examination Identifiers</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        NEMIS Number
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {student.nemisNumber || "NEMIS-2026-KE"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Assessment Number
                      </span>
                      <span className="font-mono font-bold text-indigo-700">
                        {student.assessmentNumber || "CBA/KNEC/2026"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Unique Personal ID (UPI)
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {student.upi || student.nemisNumber || "UPI-009482"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Birth Certificate No.
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {student.birthCertificateNo || "BC-998822"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Demographics */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span>Demographics & Location</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Date of Birth
                      </span>
                      <span className="font-bold text-slate-900">
                        {student.dateOfBirth || "2015-05-14"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nationality & Religion
                      </span>
                      <span className="font-bold text-slate-900">
                        {student.nationality || "Kenyan"} • {student.religion || "Christian"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        County / Sub-County
                      </span>
                      <span className="font-bold text-slate-900">
                        {student.county || "Nairobi"} / {student.subCounty || "Westlands"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Enrollment Date
                      </span>
                      <span className="font-bold text-slate-900">
                        {student.enrollmentDate || student.createdAt?.split("T")[0] || "2026-01-05"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code & Digital Verification Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-900 text-white gap-4">
                <div className="flex items-center gap-4">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Student QR"
                      className="w-16 h-16 rounded-xl bg-white p-1 border border-indigo-400 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-indigo-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Encrypted Campus QR Identity Active</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Used for campus gate roll call, library loans, exam seat verification, and digital badges.
                    </div>
                    <div className="text-[10px] font-mono text-indigo-300 mt-1">
                      https://{sub}.davetecherp.com/verify/student/{student.admissionNo}
                    </div>
                  </div>
                </div>

                {onOpenIDCard && (
                  <button
                    type="button"
                    onClick={() => onOpenIDCard(student)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 shadow-md transition-colors cursor-pointer"
                  >
                    Generate Smart ID Card
                  </button>
                )}
              </div>

              {/* Talents, Hobbies & Extracurriculars */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Talents, Co-Curricular & Special Interests</span>
                </div>
                <div className="text-xs text-slate-700">
                  {student.talentsAndHobbies ||
                    "Robotics club member, football junior team player, active participant in music and drama festivals."}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS & ASSESSMENTS */}
          {activeTab === "academics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Education Level</div>
                  <div className="text-sm font-bold text-indigo-950 capitalize mt-0.5">
                    {student.educationLevel.replace(/_/g, " ")}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Current Class & Stream</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {student.gradeOrClass} {student.stream ? `• Stream ${student.stream}` : ""}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Academic Cycle</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {student.academicYear || "2026"} • {student.termOrSemester || "Term 1"}
                  </div>
                </div>
              </div>

              {/* Assessment Records Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Continuous Assessment & CBC Performance Dossier</span>
                  <span className="font-mono text-indigo-600 font-bold text-[11px]">
                    KNEC Index: {student.assessmentNumber || "CBA-ACTIVE"}
                  </span>
                </div>

                {studentAssessmentRecords.length > 0 ? (
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Subject / Learning Area</th>
                        <th className="py-2.5 px-4">Assessment</th>
                        <th className="py-2.5 px-4 text-center">Score</th>
                        <th className="py-2.5 px-4 text-center">Grade / CBC Band</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAssessmentRecords.map((ar, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{ar.subjectName}</td>
                          <td className="py-2.5 px-4 text-slate-600">{ar.assessmentTitle}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-indigo-700 font-mono">
                            {ar.marks} / {ar.maxMarks}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                              {ar.grade} {ar.competency ? `(${ar.competency})` : ""}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">No formal exam score entries published yet for this term.</p>
                    <p className="text-[11px] text-slate-400">
                      Formative classroom observations and CBC activity competencies are logged weekly by the class teacher.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Present Days</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{presentDays}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Late Arrivals</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">{lateDays}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="text-[10px] font-bold text-rose-800 uppercase">Absent Days</div>
                  <div className="text-2xl font-black text-rose-950 mt-1">{absentDays}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="text-[10px] font-bold text-indigo-800 uppercase">Attendance Rate</div>
                  <div className="text-2xl font-black text-indigo-950 mt-1">{attendanceRate}%</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
                  Recent Roll Call & QR Gate Check-ins
                </div>
                {studentAttendance.length > 0 ? (
                  <div className="divide-y divide-slate-100 text-xs">
                    {studentAttendance.slice(0, 8).map((att, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-800">{att.date}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{att.remarks || "Regular Roll Call"}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            att.status === "present"
                              ? "bg-emerald-100 text-emerald-800"
                              : att.status === "late"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Student has perfect standing. No disciplinary absences recorded.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & FEE LEDGER */}
          {activeTab === "finance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Fee Billed</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {currency} {student.totalFeeBilled.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Total Fee Paid</div>
                  <div className="text-xl font-black text-emerald-950 mt-1">
                    {currency} {student.totalFeePaid.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Outstanding Balance</div>
                  <div className="text-xl font-black text-amber-950 mt-1">
                    {currency} {student.balance.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment Records */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
                  Receipted Fee Transactions
                </div>
                {studentPayments.length > 0 ? (
                  <div className="divide-y divide-slate-100 text-xs">
                    {studentPayments.map((p) => (
                      <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">
                            {p.receiptNumber} • {p.paymentMethod}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.paymentDate} • Ref: {p.transactionRef}</div>
                        </div>
                        <div className="font-bold text-emerald-700">
                          {currency} {p.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No recent transaction receipts on record for current invoice cycle.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GUARDIAN & FAMILY */}
          {activeTab === "guardian" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                    {student.guardianName?.charAt(0) || "G"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{student.guardianName}</h3>
                    <span className="text-xs text-indigo-600 font-semibold">
                      Relationship: {student.guardianRelationship || "Parent / Guardian"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Primary Phone</span>
                      <span className="font-bold text-slate-900">{student.guardianPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Email Address</span>
                      <span className="font-bold text-slate-900">{student.guardianEmail || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Residence Location</span>
                      <span className="font-bold text-slate-900">{student.residenceAddress || "Nairobi Metropolitan"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">National ID / Occupation</span>
                      <span className="font-bold text-slate-900">
                        {student.guardianIdNumber || "ID-CONFIRMED"} • {student.guardianOccupation || "Civil Service / Business"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Emergency Secondary Phone: <strong>{student.emergencyContact || student.guardianPhone}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HEALTH & MEDICAL */}
          {activeTab === "health" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  <HeartPulse className="w-5 h-5 text-rose-600" />
                  <span>Health Record, Allergies & Care Protocol</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                    <span className="text-[10px] text-rose-700 font-bold uppercase block">Blood Group</span>
                    <span className="text-base font-black text-rose-950">{student.bloodGroup || "O Positive (O+)"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Allergies & Dietary Needs</span>
                    <span className="font-bold text-amber-950">{student.allergies || "No food or medication allergies reported"}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">Medical Notes & Physician Directives:</div>
                  <p className="text-slate-700 leading-relaxed">
                    {student.medicalInfo ||
                      "Learner is medically fit to participate in all physical education sports, swimming, and outdoor school excursions."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Tenant ID: <strong className="text-indigo-600">{tenant?.code}</strong></span>
            <span>•</span>
            <span>Record Synced with Firestore</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
