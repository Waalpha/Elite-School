import React, { useState, useEffect } from "react";
import type { Student, Tenant } from "../../types";
import { generateStudentQRPayload, generateQRCodeDataUrl } from "../../utils/qrHelper";
import {
  X,
  Printer,
  QrCode,
  ShieldCheck,
  Download,
  Share2,
  Lock,
  Phone,
  Calendar,
  Sparkles,
  Check,
  Copy,
  Layers,
  RotateCw,
} from "lucide-react";

interface StudentIDCardModalProps {
  student: Student | null;
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  student,
  tenant,
  isOpen,
  onClose,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [cardLayout, setCardLayout] = useState<"portrait" | "landscape" | "double_sided">("portrait");
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!student || !isOpen) return;

    const payload = generateStudentQRPayload(student, tenant);
    generateQRCodeDataUrl(payload, { width: 300 }).then((url) => {
      setQrCodeUrl(url);
    });
  }, [student, tenant, isOpen]);

  if (!isOpen || !student) return null;

  const sub = (tenant?.subdomain || tenant?.code || "app").toLowerCase();
  const verifyUrl = `https://${sub}.davetecherp.com/verify/student/${student.admissionNo}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Student Identity Card & QR Code
              </h2>
              <p className="text-xs text-slate-500">
                Government-standard student smart ID with encrypted QR verification badge.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold px-1">Layout:</span>
            <button
              type="button"
              onClick={() => setCardLayout("portrait")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                cardLayout === "portrait"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              CR80 Vertical (Portrait)
            </button>
            <button
              type="button"
              onClick={() => setCardLayout("landscape")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                cardLayout === "landscape"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Horizontal (Landscape)
            </button>
            <button
              type="button"
              onClick={() => setCardLayout("double_sided")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                cardLayout === "double_sided"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Dual-Sided (Front & Back)
            </button>
          </div>

          {cardLayout !== "double_sided" && (
            <button
              type="button"
              onClick={() => setActiveSide((prev) => (prev === "front" ? "back" : "front"))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip to {activeSide === "front" ? "Back" : "Front"}</span>
            </button>
          )}
        </div>

        {/* PRINTABLE CARD PREVIEW CONTAINER */}
        <div className="flex justify-center p-4 bg-slate-100/70 rounded-2xl border border-slate-200 overflow-x-auto print:p-0 print:bg-transparent">
          {/* 1. PORTRAIT VIEW */}
          {cardLayout === "portrait" && (
            <div className="w-[320px] bg-white rounded-2xl shadow-xl border-2 border-indigo-600 overflow-hidden relative font-sans text-slate-900 transition-all">
              {activeSide === "front" ? (
                <div>
                  {/* Card Top Brand */}
                  <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-3.5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <img
                        src={tenant?.logo}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-white/40 bg-white"
                      />
                      <div className="text-left leading-tight">
                        <div className="text-[11px] font-black uppercase tracking-wider line-clamp-1">
                          {tenant?.name}
                        </div>
                        <div className="text-[9px] text-indigo-200 font-mono">
                          {tenant?.motto || "Excellence & Discipline"}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-indigo-950/80 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-300 border border-indigo-500/50">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>OFFICIAL STUDENT IDENTIFICATION</span>
                    </div>
                  </div>

                  {/* Student Photo & Identity */}
                  <div className="p-4 text-center space-y-3">
                    <div className="relative inline-block mx-auto">
                      <img
                        src={
                          student.photoUrl ||
                          "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200"
                        }
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-600 shadow-md mx-auto"
                      />
                      <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Active Verified Student">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {student.firstName} {student.middleName ? student.middleName + " " : ""}{student.lastName}
                      </h3>
                      <div className="text-xs font-mono font-extrabold text-indigo-700 mt-0.5">
                        ADM: {student.admissionNo}
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">
                        {student.gradeOrClass} {student.stream ? `• Stream ${student.stream}` : ""}
                      </div>
                    </div>

                    {/* NEMIS & Assessment Identifiers */}
                    <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-left text-[10px]">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">
                          NEMIS UPI
                        </span>
                        <span className="font-mono font-bold text-slate-800 truncate block">
                          {student.nemisNumber || student.upi || "NEMIS-PENDING"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">
                          Assessment No.
                        </span>
                        <span className="font-mono font-bold text-indigo-700 truncate block">
                          {student.assessmentNumber || "CBA-REGISTERED"}
                        </span>
                      </div>
                    </div>

                    {/* Scannable QR Code */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-50/60 border border-indigo-100">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Student QR Code"
                          className="w-24 h-24 rounded-lg bg-white p-1 border border-indigo-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
                          <QrCode className="w-8 h-8" />
                        </div>
                      )}
                      <span className="text-[9px] font-mono text-indigo-900 font-bold mt-1 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Scan to Verify ID & Mark Roll Call</span>
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-500 space-y-0.5">
                      <div className="flex justify-between font-semibold text-slate-600">
                        <span>Emergency: {student.guardianPhone}</span>
                        <span>Valid: {student.academicYear || "2026"}</span>
                      </div>
                      <div className="text-center font-mono text-[8px] text-indigo-600 font-bold truncate">
                        {sub}.davetecherp.com
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK SIDE */
                <div className="p-4 space-y-3 text-[10px] text-slate-700 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <div className="font-bold text-indigo-900 text-xs border-b border-slate-200 pb-1.5 mb-2 uppercase flex items-center justify-between">
                      <span>Terms & Conditions</span>
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[9px] text-slate-600">
                      <li>This card is the property of {tenant?.name}.</li>
                      <li>It must be presented upon request by school staff, campus security, or exam invigilators.</li>
                      <li>Card is strictly non-transferable. Loss must be reported immediately to the administration office.</li>
                      <li>Used for daily gate attendance, library borrowing, and assessment verification.</li>
                    </ul>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-[10px]">Medical / Emergency Info:</div>
                    <div className="text-[9px] text-slate-600">
                      Blood Group: <span className="font-bold text-slate-800">{student.bloodGroup || "O+"}</span>
                    </div>
                    <div className="text-[9px] text-slate-600">
                      Guardian: <span className="font-bold text-slate-800">{student.guardianName}</span> ({student.guardianPhone})
                    </div>
                    <div className="text-[9px] text-slate-600 truncate">
                      Medical Notes: {student.medicalInfo || "None reported"}
                    </div>
                  </div>

                  <div className="text-center pt-3 border-t border-slate-200">
                    <div className="w-24 h-6 border-b border-dashed border-slate-400 mx-auto mb-1"></div>
                    <div className="text-[9px] font-bold text-slate-800 uppercase">Authorized Principal / Registrar</div>
                    <div className="text-[8px] text-slate-400">Official Institutional Signature & Seal</div>
                    <div className="mt-2 text-[8px] font-mono text-indigo-600 font-bold">
                      PO Box {tenant?.address || "Nairobi, Kenya"} • Tel: {tenant?.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. LANDSCAPE VIEW */}
          {cardLayout === "landscape" && (
            <div className="w-[460px] bg-white rounded-2xl shadow-xl border-2 border-indigo-600 overflow-hidden font-sans text-slate-900 flex flex-col justify-between">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={tenant?.logo}
                    alt=""
                    className="w-7 h-7 rounded-md object-cover bg-white p-0.5"
                  />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide leading-tight">
                      {tenant?.name}
                    </div>
                    <div className="text-[9px] text-indigo-200 font-mono leading-tight">
                      STUDENT IDENTIFICATION CARD
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono font-bold bg-indigo-700/80 px-2 py-0.5 rounded text-emerald-300 border border-indigo-500">
                    AY {student.academicYear || "2026"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex items-center gap-4">
                {/* Photo */}
                <div className="shrink-0 text-center">
                  <img
                    src={
                      student.photoUrl ||
                      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200"
                    }
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-600 shadow-sm"
                  />
                  <span className="inline-block mt-1 font-mono text-[9px] font-extrabold text-indigo-700">
                    {student.admissionNo}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-black text-slate-900 leading-tight">
                    {student.firstName} {student.middleName ? student.middleName + " " : ""}{student.lastName}
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {student.gradeOrClass} {student.stream ? `• Stream ${student.stream}` : ""}
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[8px] uppercase">NEMIS UPI</span>
                      <span className="font-mono font-bold text-slate-800">{student.nemisNumber || student.upi || "NEMIS-PEND"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[8px] uppercase">Assessment No.</span>
                      <span className="font-mono font-bold text-indigo-700">{student.assessmentNumber || "CBA-REG"}</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-500 pt-1">
                    Emergency: <span className="font-semibold text-slate-700">{student.guardianPhone}</span> ({student.guardianName})
                  </div>
                </div>

                {/* QR Code */}
                <div className="shrink-0 text-center pl-2 border-l border-slate-100">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Student QR Code"
                      className="w-20 h-20 rounded-lg bg-white p-1 border border-indigo-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <span className="text-[8px] font-mono text-indigo-600 block mt-0.5 font-bold">
                    Scan to Verify
                  </span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-200 text-[9px] text-slate-500 flex items-center justify-between font-mono">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Authenticated by DAVETECH Multi-Tenant Core
                </span>
                <span className="text-indigo-700 font-bold">{sub}.davetecherp.com</span>
              </div>
            </div>
          )}

          {/* 3. DUAL-SIDED VIEW */}
          {cardLayout === "double_sided" && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* FRONT */}
              <div className="w-[280px] bg-white rounded-2xl shadow-xl border-2 border-indigo-600 overflow-hidden font-sans text-slate-900">
                <div className="bg-indigo-700 text-white p-2.5 text-center">
                  <div className="text-[10px] font-black uppercase tracking-wider">{tenant?.name}</div>
                  <div className="text-[8px] text-indigo-200">{tenant?.motto}</div>
                </div>
                <div className="p-3 text-center space-y-2">
                  <img
                    src={student.photoUrl || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200"}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-600 mx-auto"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-900">{student.firstName} {student.lastName}</div>
                    <div className="text-[11px] font-mono font-bold text-indigo-700">{student.admissionNo}</div>
                    <div className="text-[10px] font-semibold text-slate-600">{student.gradeOrClass}</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-left text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">NEMIS:</span>
                      <span className="font-mono font-bold">{student.nemisNumber || "NEMIS-PEND"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ass. No:</span>
                      <span className="font-mono font-bold text-indigo-600">{student.assessmentNumber || "CBA-REG"}</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-slate-400 pt-1 border-t border-slate-100">
                    Valid Academic Year 2026
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="w-[280px] bg-white rounded-2xl shadow-xl border-2 border-indigo-600 overflow-hidden font-sans text-slate-900 p-3 flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="text-[10px] font-bold text-indigo-900 uppercase border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Card Verification & QR</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="flex justify-center my-2">
                    {qrCodeUrl && (
                      <img
                        src={qrCodeUrl}
                        alt="QR"
                        className="w-24 h-24 rounded-lg border border-indigo-200 p-1 bg-white"
                      />
                    )}
                  </div>
                  <div className="text-[8px] text-center text-slate-500 font-mono">
                    Scan with any mobile device or ERP terminal to verify student records.
                  </div>
                </div>

                <div className="space-y-1 text-[8px] text-slate-600 border-t border-slate-100 pt-2">
                  <div>Emergency Contact: <span className="font-bold text-slate-800">{student.guardianPhone}</span></div>
                  <div>If found, please return to school administration office.</div>
                  <div className="font-mono font-bold text-indigo-600 text-center pt-1">{sub}.davetecherp.com</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Link & Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-200 p-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="text-slate-500 font-semibold">Verification URL: </span>
                <span className="font-mono font-bold text-indigo-900">{verifyUrl}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-indigo-300 rounded-lg text-indigo-700 font-bold hover:bg-indigo-100 shrink-0 ml-2 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {qrCodeUrl && (
                <a
                  href={qrCodeUrl}
                  download={`StudentID_${student.admissionNo}_QRCode.png`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </a>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Student ID Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
