import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Assessment, AssessmentRecord, Student, Subject } from "../../types";
import {
  subscribeToAssessments,
  saveAssessment,
  subscribeToStudents,
  subscribeToSubjects,
} from "../../services/firestoreService";
import {
  FileSpreadsheet,
  Plus,
  Printer,
  Sparkles,
  Award,
  CheckCircle,
  X,
  Search,
} from "lucide-react";

export const AssessmentManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState<boolean>(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  // Form State for new assessment
  const [assessmentTitle, setAssessmentTitle] = useState("Term 1 Mid-Term Evaluation 2026");
  const [selectedGrade, setSelectedGrade] = useState("Grade 4");
  const [selectedSubjectName, setSelectedSubjectName] = useState("Mathematics Activities");
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [marksSheet, setMarksSheet] = useState<Record<string, { marks: number; remarks: string; competency: string }>>({});

  useEffect(() => {
    if (!currentTenant) return;
    const unsubA = subscribeToAssessments(currentTenant.id, setAssessments);
    const unsubS = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    const unsubSub = subscribeToSubjects(currentTenant.id, setSubjects);
    return () => {
      unsubA();
      unsubS();
      unsubSub();
    };
  }, [currentTenant?.id, currentBranch?.id]);

  const isPrimary = currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";

  const getCompetencyLevel = (score: number, max: number): "Exceeding Expectations" | "Meeting Expectations" | "Approaching Expectations" | "Below Expectations" => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "Exceeding Expectations";
    if (pct >= 60) return "Meeting Expectations";
    if (pct >= 40) return "Approaching Expectations";
    return "Below Expectations";
  };

  const getGradeLetter = (score: number, max: number): string => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "A (Exceeding)";
    if (pct >= 65) return "B (Meeting)";
    if (pct >= 50) return "C (Approaching)";
    return "D (Below)";
  };

  const handleOpenNewAssessment = () => {
    const gradeStudents = students.filter(
      (s) => !selectedGrade || s.gradeOrClass.toLowerCase().includes(selectedGrade.toLowerCase())
    );

    const initialMarks: Record<string, { marks: number; remarks: string; competency: string }> = {};
    gradeStudents.forEach((st) => {
      initialMarks[st.id] = {
        marks: 42,
        remarks: "Good conceptual grasp and active problem solving",
        competency: "Meeting Expectations",
      };
    });

    setMarksSheet(initialMarks);
    setIsModalOpen(true);
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const gradeStudents = students.filter(
      (s) => !selectedGrade || s.gradeOrClass.toLowerCase().includes(selectedGrade.toLowerCase())
    );

    const records: AssessmentRecord[] = gradeStudents.map((st) => {
      const entry = marksSheet[st.id] || { marks: 40, remarks: "Consistent progress", competency: "Meeting Expectations" };
      const score = Number(entry.marks) || 0;
      return {
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        admissionNo: st.admissionNo,
        marks: score,
        maxMarks,
        grade: getGradeLetter(score, maxMarks),
        competencyLevel: getCompetencyLevel(score, maxMarks),
        remarks: entry.remarks || "Good effort",
      };
    });

    const payload: Assessment = {
      id: "ass_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      title: assessmentTitle,
      educationLevel: isPrimary ? "primary" : "college",
      grade: selectedGrade,
      subjectId: "sub_math",
      subjectName: selectedSubjectName,
      maxMarks,
      term: "Term 1",
      academicYear: "2026",
      date: new Date().toISOString().split("T")[0],
      records,
      createdAt: new Date().toISOString(),
    };

    await saveAssessment(currentTenant.id, payload, { name: currentUser.name });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>
              {isPrimary ? "CBC Competency Assessments & Learner Report Cards" : "Academic Examinations & Grading"}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record continuous assessment scores, CBC rubrics (EE, ME, AE, BE), and generate printable term report cards.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewAssessment}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Assessment Sheet</span>
        </button>
      </div>

      {/* CBC Competency Rubric Legend (if primary/junior school) */}
      {isPrimary && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-2">
            National Competency Based Curriculum (CBC) Performance Rubric
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="font-bold text-emerald-900">EE: Exceeding Expectations (80-100%)</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Applies concepts creatively & independently.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
              <div className="font-bold text-sky-900">ME: Meeting Expectations (60-79%)</div>
              <div className="text-[11px] text-sky-700 mt-0.5">Consistently achieves targeted learning outcomes.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <div className="font-bold text-amber-900">AE: Approaching Expectations (40-59%)</div>
              <div className="text-[11px] text-amber-700 mt-0.5">Demonstrates core competencies with minimal support.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <div className="font-bold text-rose-900">BE: Below Expectations (0-39%)</div>
              <div className="text-[11px] text-rose-700 mt-0.5">Requires targeted remedial intervention.</div>
            </div>
          </div>
        </div>
      )}

      {/* Assessments List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Recorded Assessments in Firestore ({assessments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((ass) => (
            <div
              key={ass.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {ass.grade} • {ass.term} {ass.academicYear}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{ass.title}</h3>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">
                    Subject: <span className="text-indigo-600 font-bold">{ass.subjectName}</span> (Max: {ass.maxMarks} marks)
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">{ass.date}</div>
              </div>

              {/* Top student scores preview */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                {ass.records.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{r.studentName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{r.marks}/{r.maxMarks}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {r.competencyLevel ? r.competencyLevel.split(" ")[0] : r.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {ass.records.length} Learner Scores Logged
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const firstStudent = students.find((s) => s.id === ass.records[0]?.studentId) || students[0];
                    setSelectedStudentForReport(firstStudent);
                    setSelectedAssessment(ass);
                    setIsReportCardOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print CBC Report Card</span>
                </button>
              </div>
            </div>
          ))}

          {assessments.length === 0 && (
            <div className="col-span-2 p-8 text-center rounded-xl bg-white border border-slate-200 text-slate-400 text-xs">
              Click &quot;Record New Assessment Sheet&quot; to log student exam marks into Firestore.
            </div>
          )}
        </div>
      </div>

      {/* NEW ASSESSMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Record Marks & CBC Competency Scores</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade / Class</label>
                  <input
                    type="text"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    placeholder="e.g. Grade 4"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject / Learning Area</label>
                  <input
                    type="text"
                    value={selectedSubjectName}
                    onChange={(e) => setSelectedSubjectName(e.target.value)}
                    placeholder="e.g. Mathematics Activities"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Student Marks Sheet Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3 w-28">Score (/{maxMarks})</th>
                      <th className="py-2.5 px-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((st) => {
                      const entry = marksSheet[st.id] || { marks: 40, remarks: "Good progress", competency: "ME" };
                      return (
                        <tr key={st.id}>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{st.firstName} {st.lastName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{st.admissionNo}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={entry.marks}
                              onChange={(e) =>
                                setMarksSheet({
                                  ...marksSheet,
                                  [st.id]: { ...entry, marks: Number(e.target.value) },
                                })
                              }
                              className="w-20 p-1.5 rounded border border-slate-200 text-center font-bold"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={entry.remarks}
                              onChange={(e) =>
                                setMarksSheet({
                                  ...marksSheet,
                                  [st.id]: { ...entry, remarks: e.target.value },
                                })
                              }
                              className="w-full p-1.5 rounded border border-slate-200"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  Save Assessment Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE CBC REPORT CARD MODAL */}
      {isReportCardOpen && selectedStudentForReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8 print:p-0 print:border-none print:shadow-none">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 print:hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Official CBC Learner Report Card</h3>
              <button onClick={() => setIsReportCardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Report Card Body */}
            <div className="mt-4 p-6 border-2 border-slate-800 rounded-xl space-y-5 bg-white text-slate-900">
              {/* School Header */}
              <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                <img
                  src={currentTenant?.logo}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover mx-auto mb-2 border border-slate-300"
                />
                <h1 className="text-xl font-black uppercase tracking-wide">{currentTenant?.name}</h1>
                <p className="text-xs italic text-slate-600">{currentTenant?.motto}</p>
                <p className="text-[11px] text-slate-500">{currentTenant?.address} • Phone: {currentTenant?.phone}</p>
                <div className="inline-block mt-2 px-4 py-1 rounded bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                  CBC LEARNER SUMMATIVE PROGRESS REPORT
                </div>
              </div>

              {/* Student Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Learner Name</div>
                  <div className="font-bold text-slate-900">
                    {selectedStudentForReport.firstName} {selectedStudentForReport.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Admission No</div>
                  <div className="font-mono font-bold text-indigo-700">{selectedStudentForReport.admissionNo}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Grade & Stream</div>
                  <div className="font-bold">{selectedStudentForReport.gradeOrClass} ({selectedStudentForReport.stream || "East"})</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Term / Year</div>
                  <div className="font-bold">Term 1, 2026</div>
                </div>
              </div>

              {/* CBC Learning Area Assessment Table */}
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-800 uppercase border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Learning Area</th>
                    <th className="p-2 border-r border-slate-300 text-center">Score</th>
                    <th className="p-2 border-r border-slate-300">Competency Level</th>
                    <th className="p-2">Educator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Mathematics Activities</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">48/50</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-emerald-800">Exceeding Expectations (EE)</td>
                    <td className="p-2 text-[11px]">Outstanding spatial and mathematical reasoning.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">English Language Activities</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">44/50</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-emerald-800">Exceeding Expectations (EE)</td>
                    <td className="p-2 text-[11px]">Fluent reading, creative storytelling and grammar.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Science & Technology</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">40/50</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-sky-800">Meeting Expectations (ME)</td>
                    <td className="p-2 text-[11px]">Enthusiastic participant in laboratory experiments.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Social Studies & CRE</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">39/50</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-sky-800">Meeting Expectations (ME)</td>
                    <td className="p-2 text-[11px]">Strong awareness of civic and community roles.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">Creative Arts & Sports</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">46/50</td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-emerald-800">Exceeding Expectations (EE)</td>
                    <td className="p-2 text-[11px]">Exceptional motor coordination and artistic design.</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures Block */}
              <div className="pt-4 grid grid-cols-2 gap-8 text-xs">
                <div className="border-t border-slate-400 pt-1">
                  <div className="font-bold">Class Teacher: Teacher Sarah Mwangi</div>
                  <div className="text-[10px] text-slate-500">Signature: ______________________</div>
                </div>
                <div className="border-t border-slate-400 pt-1 text-right">
                  <div className="font-bold">Head Teacher / Principal</div>
                  <div className="text-[10px] text-slate-500">Official Stamp & Date</div>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-between items-center mt-6 print:hidden">
              <button
                type="button"
                onClick={() => setIsReportCardOpen(false)}
                className="text-xs font-semibold text-slate-500"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
