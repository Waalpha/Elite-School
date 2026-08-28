import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import type { Student, Tenant, User } from "../../types";
import { saveAttendanceRecord } from "../../services/firestoreService";
import {
  QrCode,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
  Search,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  Award,
  RefreshCw,
} from "lucide-react";

interface QRAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  tenant: Tenant | null;
  currentUser: User;
  selectedDate: string;
  onStudentScanned?: (student: Student, status: "present" | "late") => void;
}

export const QRAttendanceModal: React.FC<QRAttendanceModalProps> = ({
  isOpen,
  onClose,
  students,
  tenant,
  currentUser,
  selectedDate,
  onStudentScanned,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanStatusMode, setScanStatusMode] = useState<"present" | "late">("present");
  const [manualCode, setManualCode] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Last scanned student feedback
  const [lastScanned, setLastScanned] = useState<{
    student: Student;
    timestamp: string;
    status: "present" | "late";
  } | null>(null);

  // Scanned history list in current session
  const [sessionScannedList, setSessionScannedList] = useState<
    Array<{ student: Student; timestamp: string; status: "present" | "late" }>
  >([]);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = "html5qr-attendance-reader";

  // Play audio beep
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  const handleProcessCode = async (rawCode: string) => {
    if (!rawCode || !tenant) return;
    const clean = rawCode.trim();

    // 1. Try to parse JSON payload (DAVETECH Student ID standard)
    let searchKey = clean;
    try {
      if (clean.startsWith("{") && clean.endsWith("}")) {
        const parsed = JSON.parse(clean);
        if (parsed.admissionNo) {
          searchKey = parsed.admissionNo;
        } else if (parsed.studentId) {
          searchKey = parsed.studentId;
        }
      }
    } catch {
      // Not json, use direct string
    }

    // 2. Lookup student in database
    const matched = students.find((s) => {
      const lowerKey = searchKey.toLowerCase();
      return (
        s.admissionNo.toLowerCase() === lowerKey ||
        s.id.toLowerCase() === lowerKey ||
        (s.nemisNumber && s.nemisNumber.toLowerCase() === lowerKey) ||
        (s.assessmentNumber && s.assessmentNumber.toLowerCase() === lowerKey) ||
        `${s.firstName} ${s.lastName}`.toLowerCase() === lowerKey ||
        clean.toLowerCase().includes(s.admissionNo.toLowerCase())
      );
    });

    if (matched) {
      playBeep();
      const nowTime = new Date().toLocaleTimeString();

      // Save to Firestore
      const record = {
        id: `att_${selectedDate}_${matched.id}`,
        tenantId: tenant.id,
        branchId: matched.branchId || "main",
        date: selectedDate,
        studentId: matched.id,
        studentName: `${matched.firstName} ${matched.lastName}`,
        admissionNo: matched.admissionNo,
        gradeOrClass: matched.gradeOrClass,
        status: scanStatusMode,
        remarks: `QR Gate Scanner Check-in at ${nowTime}`,
        recordedBy: currentUser.name,
        createdAt: new Date().toISOString(),
      };

      await saveAttendanceRecord(tenant.id, record, { name: currentUser.name });

      const entry = { student: matched, timestamp: nowTime, status: scanStatusMode };
      setLastScanned(entry);
      setSessionScannedList((prev) => [entry, ...prev.filter((p) => p.student.id !== matched.id)]);

      if (onStudentScanned) {
        onStudentScanned(matched, scanStatusMode);
      }
    } else {
      setCameraError(`No student record matched the code: "${rawCode}"`);
      setTimeout(() => setCameraError(null), 4000);
    }
  };

  // Start Html5Qrcode scanner
  const startScanner = async () => {
    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
          ],
          verbose: false,
        });
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessCode(decodedText);
        },
        () => {
          // Ignored per-frame scan misses
        }
      );
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn("Scanner camera init fallback:", err);
      setCameraActive(false);
      setCameraError(
        "Camera stream not accessible in current window. You can use the Quick Learner Selector or Barcode input below."
      );
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn("Stop scanner error:", err);
      }
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Delay slightly to ensure DOM element exists
      const timer = setTimeout(() => {
        startScanner();
      }, 250);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Campus QR Code Attendance & Gate Scanner</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Date: {selectedDate}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Point camera at student smart ID badges to instantly verify and log daily roll call.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode & Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold text-[11px]">Check-in Status:</span>
            <button
              type="button"
              onClick={() => setScanStatusMode("present")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                scanStatusMode === "present"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Mark Present (On Time)
            </button>
            <button
              type="button"
              onClick={() => setScanStatusMode("late")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                scanStatusMode === "late"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Mark Late Arrival
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio Beep ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Audio Muted</span>
              </>
            )}
          </button>
        </div>

        {/* Scanner Viewport & Live Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Camera Scanner Box */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 text-white relative min-h-[280px] overflow-hidden border border-slate-800">
            {/* HTML5 QR Camera Container */}
            <div id={scannerElementId} className="w-full max-w-[280px] rounded-xl overflow-hidden text-slate-900"></div>

            {!cameraActive && (
              <div className="text-center p-4 space-y-2">
                <Camera className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
                <div className="text-xs font-bold text-slate-300">Live Camera Ready</div>
                <button
                  type="button"
                  onClick={startScanner}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Start Camera Scan
                </button>
              </div>
            )}

            {/* Error notice */}
            {cameraError && (
              <div className="mt-2 p-2 bg-rose-950/80 border border-rose-600 text-rose-200 text-[10px] rounded-lg text-center">
                {cameraError}
              </div>
            )}
          </div>

          {/* Right: Last Scanned Confirmation Card & Rapid Manual Input */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Last Scanned Feedback Banner */}
            {lastScanned ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-md space-y-3 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attendance Verified!</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    {lastScanned.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={lastScanned.student.photoUrl}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div>
                    <div className="font-black text-slate-900 text-sm">
                      {lastScanned.student.firstName} {lastScanned.student.lastName}
                    </div>
                    <div className="text-xs font-mono font-bold text-indigo-700">
                      ADM: {lastScanned.student.admissionNo}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {lastScanned.student.gradeOrClass} {lastScanned.student.stream ? `• Stream ${lastScanned.student.stream}` : ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-emerald-200 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">NEMIS UPI</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {lastScanned.student.nemisNumber || "NEMIS-RECORDED"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Assessment No.</span>
                    <span className="font-bold text-indigo-700 truncate block">
                      {lastScanned.student.assessmentNumber || "CBA-ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <QrCode className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Awaiting QR Scan</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Hold a Student ID Card with QR code in front of the camera or enter an admission number below.
                </p>
              </div>
            )}

            {/* Quick Manual / Barcode Entry */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">
                Barcode Scanner / Admission Code Input
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualCode) {
                    handleProcessCode(manualCode);
                    setManualCode("");
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type Admission No, NEMIS, or Name..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Verify & Log
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Tap Student Roll Call Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Quick 1-Click Roll Call (All Enrolled Students)</span>
            <span className="text-[10px] text-slate-400">{students.length} Students in Register</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
            {students.slice(0, 8).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleProcessCode(st.admissionNo)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all cursor-pointer group"
              >
                <img
                  src={st.photoUrl}
                  alt=""
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                    {st.firstName} {st.lastName}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 truncate">{st.admissionNo}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Session Scanned Feed */}
        {sessionScannedList.length > 0 && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="font-bold text-slate-700 text-[11px]">
              Scanned in Current Session ({sessionScannedList.length} Checked In):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {sessionScannedList.map((entry, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] text-slate-800 font-medium shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="font-bold">{entry.student.firstName} {entry.student.lastName}</span>
                  <span className="font-mono text-slate-400">({entry.timestamp})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Done Scanning
          </button>
        </div>
      </div>
    </div>
  );
};
