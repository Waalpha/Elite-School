import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { AttendanceRecord, Student } from "../../types";
import {
  subscribeToAttendance,
  saveAttendanceRecord,
  subscribeToStudents,
} from "../../services/firestoreService";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Sparkles,
  Users,
  Search,
} from "lucide-react";

export const AttendanceManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>("Grade 4");

  // Local state of today's attendance for the selected grade
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, { status: "present" | "absent" | "late" | "excused"; remarks: string }>
  >({});

  useEffect(() => {
    if (!currentTenant) return;
    const unsubS = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    const unsubA = subscribeToAttendance(currentTenant.id, setAttendanceRecords, selectedDate);
    return () => {
      unsubS();
      unsubA();
    };
  }, [currentTenant?.id, currentBranch?.id, selectedDate]);

  const gradeStudents = students.filter(
    (s) => !selectedGrade || s.gradeOrClass.toLowerCase().includes(selectedGrade.toLowerCase())
  );

  // Initialize or update status mapping when attendanceRecords change
  useEffect(() => {
    const map: Record<string, { status: "present" | "absent" | "late" | "excused"; remarks: string }> = {};
    gradeStudents.forEach((st) => {
      const existing = attendanceRecords.find((r) => r.studentId === st.id);
      if (existing) {
        map[st.id] = { status: existing.status, remarks: existing.remarks || "" };
      } else {
        map[st.id] = { status: "present", remarks: "" };
      }
    });
    setAttendanceStatus(map);
  }, [attendanceRecords, selectedGrade, students]);

  const handleSetStatus = async (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    if (!currentTenant) return;
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));

    const record: AttendanceRecord = {
      id: `att_${selectedDate}_${studentId}`,
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      date: selectedDate,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      admissionNo: st.admissionNo,
      gradeOrClass: st.gradeOrClass,
      status,
      remarks: attendanceStatus[studentId]?.remarks || "",
      recordedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    await saveAttendanceRecord(currentTenant.id, record, { name: currentUser.name });
  };

  const handleMarkAllPresent = async () => {
    if (!currentTenant) return;
    for (const st of gradeStudents) {
      await handleSetStatus(st.id, "present");
    }
  };

  const attendanceList = Object.values(attendanceStatus) as Array<{ status: "present" | "absent" | "late" | "excused"; remarks: string }>;
  const presentCount = attendanceList.filter((v) => v.status === "present").length;
  const absentCount = attendanceList.filter((v) => v.status === "absent").length;
  const lateCount = attendanceList.filter((v) => v.status === "late").length;
  const attendanceRate = gradeStudents.length > 0 ? Math.round((presentCount / gradeStudents.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <span>Daily Attendance Register</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time roll call logging, daily absenteeism tracking, and automatic attendance statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-bold text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Roll Call Total</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{gradeStudents.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
          <div className="text-[11px] font-bold text-emerald-800 uppercase">Present Today</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{presentCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/40">
          <div className="text-[11px] font-bold text-rose-800 uppercase">Absent</div>
          <div className="text-2xl font-black text-rose-900 mt-1">{absentCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
          <div className="text-[11px] font-bold text-indigo-800 uppercase">Attendance Rate</div>
          <div className="text-2xl font-black text-indigo-900 mt-1">{attendanceRate}%</div>
        </div>
      </div>

      {/* Class Selector Filter */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-700">Filter Class / Grade:</div>
        <input
          type="text"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          placeholder="e.g. Grade 4, PP1, Year 1"
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Learner / Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4 text-center">Attendance Status</th>
              <th className="py-3 px-4">Notes / Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {gradeStudents.map((st) => {
              const current = attendanceStatus[st.id]?.status || "present";
              return (
                <tr key={st.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.photoUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{st.firstName} {st.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.admissionNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{st.gradeOrClass}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetStatus(st.id, "present")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          current === "present"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetStatus(st.id, "absent")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          current === "absent"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetStatus(st.id, "late")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          current === "late"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Add note (e.g. Doctor's appointment)"
                      value={attendanceStatus[st.id]?.remarks || ""}
                      onChange={(e) =>
                        setAttendanceStatus((prev) => ({
                          ...prev,
                          [st.id]: { ...prev[st.id], remarks: e.target.value },
                        }))
                      }
                      className="w-full p-1.5 rounded border border-slate-200 text-xs"
                    />
                  </td>
                </tr>
              );
            })}

            {gradeStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No students in this class. Select a different grade above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
