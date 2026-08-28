import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { AcademicClass, Subject, Course, AcademicYear, FeeStructure, EducationLevel } from "../../types";
import {
  subscribeToClasses,
  saveClass,
  deleteClass,
  subscribeToSubjects,
  saveSubject,
  deleteSubject,
  subscribeToCourses,
  saveCourse,
  deleteCourse,
  subscribeToAcademicYears,
  saveAcademicYear,
  subscribeToFeeStructures,
  saveFeeStructure,
  deleteFeeStructure,
} from "../../services/firestoreService";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Users,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  Receipt,
  DollarSign,
  AlertCircle,
  FileText,
} from "lucide-react";

export const AcademicsManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [activeSubTab, setActiveSubTab] = useState<"classes" | "subjects" | "courses" | "fee_structures">("classes");

  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isFeeStructureModalOpen, setIsFeeStructureModalOpen] = useState(false);

  // Forms
  const [classForm, setClassForm] = useState<Partial<AcademicClass>>({
    name: "",
    educationLevel: "primary",
    grade: "Grade 4",
    stream: "East",
    classTeacherName: "",
    room: "",
    capacity: 35,
    academicYear: "2026",
    term: "Term 1",
  });

  const [subjectForm, setSubjectForm] = useState<Partial<Subject>>({
    code: "",
    name: "",
    educationLevel: "primary",
    gradeLevels: ["Grade 4", "Grade 5", "Grade 6"],
  });

  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    code: "",
    title: "",
    department: "School of Computing",
    level: "Diploma",
    duration: "2 Years",
    feePerTerm: 25000,
    description: "",
    status: "active",
  });

  const [feeStructureForm, setFeeStructureForm] = useState<{
    id?: string;
    gradeOrCourse: string;
    educationLevel: EducationLevel;
    academicYear: string;
    term: string;
    items: { name: string; amount: number }[];
  }>({
    gradeOrCourse: "Grade 4",
    educationLevel: "primary",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { name: "Tuition & CBC Facilitation", amount: 18000 },
      { name: "CBC Assessment & Practical Materials", amount: 4000 },
      { name: "Activity, Physical Education & Sports", amount: 2500 },
      { name: "ICT Lab & Computer Literacy", amount: 2500 },
      { name: "School Lunch & Mid-Morning Snack", amount: 5000 },
      { name: "PTA & Development Levy", amount: 1500 },
    ],
  });

  useEffect(() => {
    if (!currentTenant) return;

    const unsubC = subscribeToClasses(currentTenant.id, setClasses);
    const unsubS = subscribeToSubjects(currentTenant.id, setSubjects);
    const unsubCo = subscribeToCourses(currentTenant.id, setCourses);
    const unsubY = subscribeToAcademicYears(currentTenant.id, setAcademicYears);
    const unsubF = subscribeToFeeStructures(currentTenant.id, setFeeStructures);

    return () => {
      unsubC();
      unsubS();
      unsubCo();
      unsubY();
      unsubF();
    };
  }, [currentTenant?.id]);

  const isPrimary = currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";
  const currency = currentTenant?.currency || "KES";

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const id = classForm.id || "cls_" + Date.now();
    const payload: AcademicClass = {
      id,
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      name: classForm.name || `${classForm.grade} ${classForm.stream}`,
      educationLevel: classForm.educationLevel || "primary",
      grade: classForm.grade || "Grade 1",
      stream: classForm.stream || "A",
      classTeacherName: classForm.classTeacherName || "Unassigned",
      room: classForm.room || "Room 1",
      capacity: Number(classForm.capacity) || 30,
      academicYear: classForm.academicYear || "2026",
      term: classForm.term || "Term 1",
      createdAt: new Date().toISOString(),
    };

    await saveClass(currentTenant.id, payload);
    setIsClassModalOpen(false);
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const id = subjectForm.id || "sbj_" + Date.now();
    const payload: Subject = {
      id,
      tenantId: currentTenant.id,
      code: subjectForm.code || "SUB-" + Math.floor(100 + Math.random() * 900),
      name: subjectForm.name || "Learning Area",
      educationLevel: subjectForm.educationLevel || "primary",
      gradeLevels: subjectForm.gradeLevels || ["Grade 1", "Grade 2"],
      createdAt: new Date().toISOString(),
    };

    await saveSubject(currentTenant.id, payload);
    setIsSubjectModalOpen(false);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const id = courseForm.id || "crs_" + Date.now();
    const payload: Course = {
      id,
      tenantId: currentTenant.id,
      code: courseForm.code || "CRS-" + Math.floor(100 + Math.random() * 900),
      title: courseForm.title || "Academic Program",
      department: courseForm.department || "Academic Dept",
      level: courseForm.level || "Diploma",
      duration: courseForm.duration || "2 Years",
      feePerTerm: Number(courseForm.feePerTerm) || 25000,
      description: courseForm.description || "",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await saveCourse(currentTenant.id, payload);
    setIsCourseModalOpen(false);
  };

  const handleSaveFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const totalAmount = feeStructureForm.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const id = feeStructureForm.id || "fee_struct_" + Date.now();

    const payload: FeeStructure = {
      id,
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      educationLevel: feeStructureForm.educationLevel,
      gradeOrCourse: feeStructureForm.gradeOrCourse,
      academicYear: feeStructureForm.academicYear,
      term: feeStructureForm.term,
      items: feeStructureForm.items.map((it) => ({ name: it.name, amount: Number(it.amount) || 0 })),
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    await saveFeeStructure(currentTenant.id, payload);
    setIsFeeStructureModalOpen(false);
  };

  const handleDeleteFeeStructure = async (feeId: string) => {
    if (!currentTenant) return;
    if (confirm("Are you sure you want to delete this fee structure from Firestore?")) {
      await deleteFeeStructure(currentTenant.id, feeId, { name: currentUser.name });
    }
  };

  const handleAddFeeItem = () => {
    setFeeStructureForm({
      ...feeStructureForm,
      items: [...feeStructureForm.items, { name: "Activity / Extra Levy", amount: 1500 }],
    });
  };

  const handleRemoveFeeItem = (index: number) => {
    const nextItems = [...feeStructureForm.items];
    nextItems.splice(index, 1);
    setFeeStructureForm({ ...feeStructureForm, items: nextItems });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Academic Curriculum, Classes & Learning Structure</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure classes, streams, CBC learning areas, TVET programs, and term fee structures in Firestore.
          </p>
        </div>

        {/* Sub-tabs Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab("classes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === "classes" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Classes & Streams ({classes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("subjects")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === "subjects" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isPrimary ? "CBC Subjects & Learning Areas" : "Subjects / Units"} ({subjects.length})
          </button>
          {!isPrimary && (
            <button
              type="button"
              onClick={() => setActiveSubTab("courses")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === "courses" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Accredited Courses ({courses.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveSubTab("fee_structures")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSubTab === "fee_structures" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Fee Structures ({feeStructures.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CLASSES & STREAMS */}
      {activeSubTab === "classes" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-slate-600">
              Active Class Roster (Pre-Primary, Primary Grade 1-6 & Junior School Grade 7-9)
            </div>
            <button
              type="button"
              onClick={() => {
                setClassForm({
                  name: "",
                  educationLevel: isPrimary ? "primary" : "college",
                  grade: isPrimary ? "Grade 4" : "Diploma ICT",
                  stream: "East",
                  classTeacherName: "",
                  room: "Room 101",
                  capacity: 35,
                  academicYear: "2026",
                  term: "Term 1",
                });
                setIsClassModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Class / Stream</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {cls.educationLevel.replace("_", " ")}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{cls.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Grade: <span className="font-semibold text-slate-800">{cls.grade}</span> • Stream:{" "}
                      <span className="font-semibold text-slate-800">{cls.stream}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteClass(currentTenant!.id, cls.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Teacher:</span>
                    <span className="font-bold text-slate-800">{cls.classTeacherName || "TBD"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Room / Capacity:</span>
                    <span>
                      {cls.room || "Block A"} ({cls.capacity || 30} seats)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS & CBC LEARNING AREAS */}
      {activeSubTab === "subjects" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-slate-600">Curriculum Subjects & CBC Strands</div>
            <button
              type="button"
              onClick={() => {
                setSubjectForm({
                  code: "SUB-" + Math.floor(100 + Math.random() * 900),
                  name: "",
                  educationLevel: "primary",
                  gradeLevels: ["Grade 4", "Grade 5", "Grade 6"],
                });
                setIsSubjectModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Learning Area</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sbj) => (
              <div key={sbj.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {sbj.code}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-2">{sbj.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteSubject(currentTenant!.id, sbj.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {sbj.gradeLevels.map((lvl, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TVET / TERTIARY COURSES */}
      {activeSubTab === "courses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-slate-600">Accredited Diploma & Certificate Courses</div>
            <button
              type="button"
              onClick={() => {
                setCourseForm({
                  code: "DIP-" + Math.floor(100 + Math.random() * 900),
                  title: "",
                  department: "School of Computing",
                  level: "Diploma",
                  duration: "2 Years",
                  feePerTerm: 28000,
                  description: "",
                  status: "active",
                });
                setIsCourseModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((crs) => (
              <div key={crs.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {crs.code}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-2">{crs.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{crs.department}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCourse(currentTenant!.id, crs.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
                  <span>{crs.duration}</span>
                  <span className="font-bold text-emerald-700">
                    {currency} {crs.feePerTerm.toLocaleString()} / term
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEE STRUCTURES & LEVIES */}
      {activeSubTab === "fee_structures" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-900">Termly Fee Structures & CBC Levies</div>
              <div className="text-[11px] text-slate-500">
                Define comprehensive fee breakdown per grade or TVET course for automated learner invoicing.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFeeStructureForm({
                  gradeOrCourse: isPrimary ? "Grade 5" : "Diploma in ICT",
                  educationLevel: isPrimary ? "primary" : "college",
                  academicYear: "2026",
                  term: "Term 1",
                  items: [
                    { name: "Tuition & Instructional Materials", amount: 16000 },
                    { name: "CBC Assessment & Practical Exam Fees", amount: 3500 },
                    { name: "Physical Education, Clubs & Sports", amount: 2000 },
                    { name: "ICT & Digital Lab Subscription", amount: 2500 },
                    { name: "School Lunch & Midday Refreshment", amount: 5500 },
                    { name: "Maintenance & PTA Development", amount: 1500 },
                  ],
                });
                setIsFeeStructureModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fee Structure</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map((fee) => (
              <div
                key={fee.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {fee.academicYear} • {fee.term}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-2 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-indigo-600" />
                        <span>{fee.gradeOrCourse} Fee Schedule</span>
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteFeeStructure(fee.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Fee Itemized Breakdown */}
                  <div className="mt-3 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    {fee.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-600">
                        <span className="truncate pr-2">{it.name}:</span>
                        <span className="font-semibold text-slate-900 shrink-0 font-mono">
                          {currency} {it.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Term Bill:</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {currency} {fee.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {feeStructures.length === 0 && (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
              <Receipt className="w-10 h-10 text-indigo-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">No fee structures configured yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Set up tuition, lunch, exam, and activity fee structures per grade to automatically bill learners upon admission.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">New Class / Grade Stream</h3>
              <button onClick={() => setIsClassModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveClass} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 5 East, PP2 Yellow"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade / Level</label>
                  <input
                    type="text"
                    required
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stream / Section</label>
                  <input
                    type="text"
                    value={classForm.stream}
                    onChange={(e) => setClassForm({ ...classForm, stream: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Class Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Teacher Grace Mwangi"
                  value={classForm.classTeacherName}
                  onChange={(e) => setClassForm({ ...classForm, classTeacherName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">New Subject / CBC Learning Area</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSubject} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Integrated Science"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">New TVET / Tertiary Course</h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fee Per Term ({currency})</label>
                  <input
                    type="number"
                    value={courseForm.feePerTerm}
                    onChange={(e) => setCourseForm({ ...courseForm, feePerTerm: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FEE STRUCTURE MODAL */}
      {isFeeStructureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Create New Fee Structure & Levies</h3>
              </div>
              <button onClick={() => setIsFeeStructureModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeeStructure} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Grade / Course *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 4, PP1, Diploma in IT"
                    value={feeStructureForm.gradeOrCourse}
                    onChange={(e) => setFeeStructureForm({ ...feeStructureForm, gradeOrCourse: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={feeStructureForm.educationLevel}
                    onChange={(e) =>
                      setFeeStructureForm({
                        ...feeStructureForm,
                        educationLevel: e.target.value as EducationLevel,
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="early_years">Early Years (Pre-Primary / PP1-PP2)</option>
                    <option value="primary">Primary (Grade 1 - 6)</option>
                    <option value="junior_secondary">Junior Secondary (Grade 7 - 9)</option>
                    <option value="senior_secondary">Senior Secondary (Grade 10 - 12)</option>
                    <option value="tvet">TVET / Technical College</option>
                    <option value="college">Tertiary / University</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={feeStructureForm.academicYear}
                    onChange={(e) => setFeeStructureForm({ ...feeStructureForm, academicYear: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Term / Semester</label>
                  <select
                    value={feeStructureForm.term}
                    onChange={(e) => setFeeStructureForm({ ...feeStructureForm, term: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Fee Items */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700">Fee Components & Levies:</span>
                  <button
                    type="button"
                    onClick={handleAddFeeItem}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {feeStructureForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Item name (e.g. Tuition, Lunch)"
                        value={item.name}
                        onChange={(e) => {
                          const nextItems = [...feeStructureForm.items];
                          nextItems[idx].name = e.target.value;
                          setFeeStructureForm({ ...feeStructureForm, items: nextItems });
                        }}
                        className="flex-1 p-2 rounded-lg border border-slate-200"
                      />
                      <div className="relative w-32 shrink-0">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                          {currency}
                        </span>
                        <input
                          type="number"
                          required
                          min={0}
                          value={item.amount}
                          onChange={(e) => {
                            const nextItems = [...feeStructureForm.items];
                            nextItems[idx].amount = Number(e.target.value) || 0;
                            setFeeStructureForm({ ...feeStructureForm, items: nextItems });
                          }}
                          className="w-full pl-12 pr-2 py-2 rounded-lg border border-slate-200 font-mono text-right"
                        />
                      </div>
                      {feeStructureForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeeItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Preview */}
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">Total Calculated Bill:</span>
                  <span className="text-sm font-black text-emerald-800 font-mono">
                    {currency} {feeStructureForm.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeeStructureModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-xs"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
