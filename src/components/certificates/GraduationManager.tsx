import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Certificate, Student } from "../../types";
import {
  subscribeToCertificates,
  issueCertificate,
  subscribeToStudents,
} from "../../services/firestoreService";
import {
  Award,
  Plus,
  Printer,
  Sparkles,
  QrCode,
  ShieldCheck,
  X,
  GraduationCap,
} from "lucide-react";

export const GraduationManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const [form, setForm] = useState({
    studentId: "",
    title: "Certificate of Primary Education & CBC Completion",
    type: "CBC_Leaving" as "CBC_Leaving" | "TVET_Diploma" | "Certificate_Of_Completion" | "Degree",
    programOrClass: "Grade 6 CBC Completion",
    gradeOrHonors: "Distinction / Exceeding Expectations",
  });

  useEffect(() => {
    if (!currentTenant) return;
    const unsubC = subscribeToCertificates(currentTenant.id, setCertificates);
    const unsubS = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    return () => {
      unsubC();
      unsubS();
    };
  }, [currentTenant?.id, currentBranch?.id]);

  const isPrimary = currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";

  const handleIssueCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const student = students.find((s) => s.id === form.studentId);
    if (!student) return;

    const certNo = `CERT-${currentTenant.code}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const certId = "cert_" + Date.now();
    const qrUrl = `https://davetech-erp.web.app/verify/${currentTenant.id}/${certNo}`;

    const payload: Certificate = {
      id: certId,
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      certificateNumber: certNo,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      title: form.title,
      type: form.type,
      programOrClass: form.programOrClass,
      gradeOrHonors: form.gradeOrHonors,
      issueDate: new Date().toISOString().split("T")[0],
      qrCodeUrl: qrUrl,
      verified: true,
      issuedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    await issueCertificate(currentTenant.id, payload, { name: currentUser.name });
    setIsModalOpen(false);
    setSelectedCert(payload);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Certificates, Leaving Documents & Graduation Awards</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue authenticated CBC leaving certificates, TVET diplomas, and graduation credentials with verifiable security codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (students.length > 0) setForm((p) => ({ ...p, studentId: students[0].id }));
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Authenticated Certificate</span>
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {cert.certificateNumber}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>QR Verified</span>
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mt-2">{cert.studentName}</h3>
              <div className="text-xs text-indigo-700 font-semibold mt-0.5">{cert.title}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {cert.programOrClass} • <span className="font-bold text-slate-700">{cert.gradeOrHonors}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Issued: {cert.issueDate}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCert(cert);
                  setIsPrintModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View & Print</span>
              </button>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-3 p-12 text-center rounded-xl bg-white border border-slate-200 text-slate-400 text-xs">
            No graduation certificates issued yet. Click &quot;Issue Authenticated Certificate&quot; to award a student.
          </div>
        )}
      </div>

      {/* ISSUE CERTIFICATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Issue Official Certificate</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCert} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Learner / Graduate *</label>
                <select
                  required
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">-- Choose Learner --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) - {s.gradeOrClass}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Certificate Award Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Level / Program</label>
                  <input
                    type="text"
                    value={form.programOrClass}
                    onChange={(e) => setForm({ ...form, programOrClass: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade / Distinction</label>
                  <input
                    type="text"
                    value={form.gradeOrHonors}
                    onChange={(e) => setForm({ ...form, gradeOrHonors: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
                >
                  Issue Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE CERTIFICATE MODAL */}
      {isPrintModalOpen && selectedCert && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 my-8 print:p-0 print:border-none print:shadow-none">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 print:hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Authenticated Certificate Document</h3>
              <button onClick={() => setIsPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Canvas */}
            <div className="mt-4 p-8 border-8 border-double border-amber-600/80 rounded-2xl bg-amber-50/20 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-slate-400 text-xs font-mono">
                {selectedCert.certificateNumber}
              </div>

              {/* Logo & School Header */}
              <div className="space-y-1">
                <img
                  src={currentTenant?.logo}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover mx-auto border border-amber-300 shadow-xs"
                />
                <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wider uppercase">
                  {currentTenant?.name}
                </h1>
                <p className="text-xs text-slate-500 tracking-widest uppercase">{currentTenant?.motto}</p>
              </div>

              <div className="text-xs tracking-widest text-slate-500 uppercase font-sans">
                This is to certify that
              </div>

              {/* Student Name */}
              <div>
                <h2 className="text-2xl font-serif font-black text-indigo-950 underline decoration-amber-500 underline-offset-8">
                  {selectedCert.studentName}
                </h2>
                <div className="text-xs font-mono text-slate-500 mt-2">
                  Admission Number: {selectedCert.admissionNo}
                </div>
              </div>

              {/* Achievement description */}
              <div className="max-w-xl mx-auto text-xs text-slate-700 leading-relaxed">
                has satisfactorily completed the prescribed curriculum and demonstrated competencies for the award of
                <div className="text-base font-bold text-slate-900 mt-1 uppercase font-serif">
                  {selectedCert.title}
                </div>
                <div className="mt-1 font-semibold text-indigo-700">
                  Performance: {selectedCert.gradeOrHonors}
                </div>
              </div>

              {/* Signatures & Security Seal */}
              <div className="pt-8 grid grid-cols-3 items-end text-xs">
                <div className="text-center border-t border-slate-400 pt-1">
                  <div className="font-bold">Principal / Registrar</div>
                  <div className="text-[10px] text-slate-400">{selectedCert.issuedBy}</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-700 text-[10px] font-bold uppercase tracking-tighter">
                    Official Seal
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">{selectedCert.issueDate}</div>
                </div>

                <div className="text-center border-t border-slate-400 pt-1">
                  <div className="font-bold">Chairman, Board of Governors</div>
                  <div className="text-[10px] text-slate-400">Authorized Signature</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 print:hidden">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-xs font-semibold text-slate-500"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
