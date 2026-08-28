import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Student, EducationLevel } from "../../types";
import { QRScannerModal } from "../common/QRScannerModal";
import {
  subscribeToStudents,
  saveStudent,
  deleteStudent,
  uploadFileToStorage,
} from "../../services/firestoreService";
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  UserCheck,
  Printer,
  X,
  Upload,
  Calendar,
  HeartPulse,
  GraduationCap,
  Sparkles,
  School,
  QrCode,
} from "lucide-react";

export const StudentsManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isIDCardModalOpen, setIsIDCardModalOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    admissionNo: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "male",
    dateOfBirth: "2016-01-01",
    educationLevel: "primary",
    gradeOrClass: "Grade 4",
    stream: "East",
    academicYear: "2026",
    termOrSemester: "Term 1",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianRelationship: "Parent",
    emergencyContact: "",
    medicalInfo: "None reported",
    previousSchool: "",
    photoUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200",
    status: "active",
    totalFeeBilled: 35000,
    totalFeePaid: 0,
    balance: 35000,
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentTenant) return;
    const unsub = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    return () => unsub();
  }, [currentTenant?.id, currentBranch?.id]);

  const currency = currentTenant?.currency || "KES";
  const isPrimaryTenant =
    currentTenant?.type === "school_primary" || currentTenant?.type === "school_junior";

  const educationLevels: { id: EducationLevel; label: string }[] = [
    { id: "pre_primary", label: "Pre-Primary (Playgroup, PP1, PP2)" },
    { id: "primary", label: "Primary School (Grade 1 - Grade 6)" },
    { id: "junior_school", label: "Junior Secondary (Grade 7 - Grade 9)" },
    { id: "secondary", label: "Secondary School (Form 1 - Form 4)" },
    { id: "tvet", label: "TVET Institution" },
    { id: "college", label: "College / Polytechnic" },
    { id: "university", label: "University Level" },
  ];

  const gradeOptions = isPrimaryTenant
    ? [
        "Playgroup",
        "PP1",
        "PP2",
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
        "Grade 9",
      ]
    : [
        "Diploma in ICT - Year 1",
        "Diploma in ICT - Year 2",
        "Diploma in Business Admin - Year 1",
        "Diploma in Business Admin - Year 2",
        "CPA Foundation",
        "CPA Intermediate",
        "Certificate in Hospitality",
        "Certificate in Electrical",
      ];

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.guardianName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || s.educationLevel === selectedLevel;
    const matchesGrade = selectedGrade === "all" || s.gradeOrClass === selectedGrade;
    return matchesSearch && matchesLevel && matchesGrade;
  });

  const handleOpenAddModal = () => {
    const autoAdm = `${currentTenant?.code || "ADM"}-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    setFormData({
      id: "std_" + Date.now(),
      admissionNo: autoAdm,
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "male",
      dateOfBirth: "2016-01-01",
      educationLevel: isPrimaryTenant ? "primary" : "college",
      gradeOrClass: isPrimaryTenant ? "Grade 1" : "Diploma in ICT - Year 1",
      stream: "East",
      academicYear: "2026",
      termOrSemester: "Term 1",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianRelationship: "Parent",
      emergencyContact: "",
      medicalInfo: "None",
      previousSchool: "",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      status: "active",
      totalFeeBilled: isPrimaryTenant ? 35000 : 48000,
      totalFeePaid: 0,
      balance: isPrimaryTenant ? 35000 : 48000,
    });
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (std: Student) => {
    setFormData({ ...std });
    setSelectedStudent(std);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const id = formData.id || "std_" + Date.now();
    const billed = Number(formData.totalFeeBilled) || 0;
    const paid = Number(formData.totalFeePaid) || 0;
    const balance = Math.max(0, billed - paid);

    const payload: Student = {
      id,
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      admissionNo: formData.admissionNo || "ADM-" + Date.now(),
      firstName: formData.firstName || "Learner",
      lastName: formData.lastName || "",
      middleName: formData.middleName || "",
      gender: (formData.gender as "male" | "female") || "male",
      dateOfBirth: formData.dateOfBirth || "2016-01-01",
      educationLevel: (formData.educationLevel as EducationLevel) || "primary",
      gradeOrClass: formData.gradeOrClass || "Grade 1",
      stream: formData.stream || "A",
      academicYear: formData.academicYear || "2026",
      termOrSemester: formData.termOrSemester || "Term 1",
      guardianName: formData.guardianName || "Guardian",
      guardianPhone: formData.guardianPhone || "+254 700 000 000",
      guardianEmail: formData.guardianEmail || "",
      guardianRelationship: formData.guardianRelationship || "Parent",
      emergencyContact: formData.emergencyContact || "",
      medicalInfo: formData.medicalInfo || "None",
      previousSchool: formData.previousSchool || "",
      photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200",
      status: (formData.status as "active" | "graduated" | "transferred" | "suspended" | "alumni") || "active",
      totalFeeBilled: billed,
      totalFeePaid: paid,
      balance,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudent(currentTenant.id, payload, { name: currentUser.name });
    setIsModalOpen(false);
  };

  const handleDelete = async (studentId: string) => {
    if (!currentTenant) return;
    if (confirm("Are you sure you want to remove this student record from Firestore?")) {
      await deleteStudent(currentTenant.id, studentId, { name: currentUser.name });
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!currentTenant) return;
    setIsUploading(true);
    try {
      const url = await uploadFileToStorage(currentTenant.id, "students", file);
      setFormData((prev) => ({ ...prev, photoUrl: url }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{isPrimaryTenant ? "Learner Admissions & Student Registry" : "Student Admissions & Registry"}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, CBC competencies, guardian contacts, and enrollment profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn_scan_qr_student"
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors shrink-0"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>Scan QR Code</span>
          </button>

          <button
            type="button"
            id="btn_add_student"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isPrimaryTenant ? "New Learner Admission" : "Enroll New Student"}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, admission no, parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All Education Levels</option>
            {educationLevels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.label}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All Classes / Grades</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Learner / Student</th>
                <th className="py-3.5 px-4">Admission No</th>
                <th className="py-3.5 px-4">Class / Grade</th>
                <th className="py-3.5 px-4">Parent / Guardian</th>
                <th className="py-3.5 px-4">Fee Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photoUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">
                          {s.firstName} {s.middleName ? s.middleName + " " : ""}{s.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.gender === "male" ? "Male" : "Female"} • {s.dateOfBirth || "DOB N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700">
                    {s.admissionNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{s.gradeOrClass}</div>
                    {s.stream && (
                      <div className="text-[10px] text-slate-400">Stream: {s.stream}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{s.guardianName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{s.guardianPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div
                      className={`font-bold ${
                        s.balance === 0 ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {currency} {s.balance.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Paid: {currency} {s.totalFeePaid.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(s);
                          setIsDetailModalOpen(true);
                        }}
                        title="View Full Profile"
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(s);
                          setIsIDCardModalOpen(true);
                        }}
                        title="Generate ID Badge"
                        className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(s)}
                        title="Edit Record"
                        className="p-1.5 rounded-md hover:bg-amber-50 text-amber-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                        className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student records found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT STUDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {selectedStudent ? "Edit Student Record" : "New Student / Learner Admission"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 mt-4 text-xs">
              {/* Photo Upload & Basic Details */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="relative group">
                  <img
                    src={formData.photoUrl}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <label className="absolute inset-0 bg-black/40 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px] font-bold">
                    <Upload className="w-4 h-4 mr-1" />
                    Change
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1 w-full space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Student Photo & ID Card Badge (Firebase Storage)
                  </div>
                  <input
                    type="text"
                    placeholder="Or enter Image URL"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Education Level & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {educationLevels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade / Class</label>
                  <input
                    type="text"
                    value={formData.gradeOrClass}
                    onChange={(e) => setFormData({ ...formData, gradeOrClass: e.target.value })}
                    placeholder="e.g. Grade 4, PP2, Diploma Year 1"
                    className="w-full p-2 rounded-lg border border-slate-200 font-semibold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stream / Section</label>
                  <input
                    type="text"
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    placeholder="e.g. East, Blue, Alpha"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Guardian Information */}
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Guardian / Parent Contact Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="+254 7..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Medical & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Medical Notes / Allergies</label>
                  <input
                    type="text"
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Initial Fee Billing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Term Fee Billed ({currency})
                  </label>
                  <input
                    type="number"
                    value={formData.totalFeeBilled}
                    onChange={(e) => setFormData({ ...formData, totalFeeBilled: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Initial Amount Paid ({currency})
                  </label>
                  <input
                    type="number"
                    value={formData.totalFeePaid}
                    onChange={(e) => setFormData({ ...formData, totalFeePaid: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors"
                >
                  Save to Firestore Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL MODAL */}
      {isDetailModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Official Student Profile Dossier</h3>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.middleName ? selectedStudent.middleName + " " : ""}{selectedStudent.lastName}
                  </div>
                  <div className="text-xs font-mono text-indigo-600 font-bold">
                    {selectedStudent.admissionNo}
                  </div>
                  <div className="text-slate-500">
                    {selectedStudent.gradeOrClass} • Stream: {selectedStudent.stream || "A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Guardian</span>
                  <div className="font-bold text-slate-800">{selectedStudent.guardianName}</div>
                  <div className="text-slate-500">{selectedStudent.guardianPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Fee Balance</span>
                  <div className="font-bold text-amber-700">
                    {currency} {selectedStudent.balance.toLocaleString()}
                  </div>
                  <div className="text-slate-400">
                    Paid: {currency} {selectedStudent.totalFeePaid.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-900 mb-1">
                  CBC Competency & Behavior Assessment Note
                </div>
                <div className="text-[11px] text-emerald-800">
                  Learner demonstrates high curiosity, active participation in collaborative team tasks, and meets national CBC learning benchmarks.
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE ID BADGE MODAL */}
      {isIDCardModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase">Student Identity Card</h3>
              <button
                type="button"
                onClick={() => setIsIDCardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ID Card Visual */}
            <div className="mt-4 border-2 border-indigo-600 rounded-2xl overflow-hidden shadow-lg bg-white text-center">
              <div className="bg-indigo-600 text-white p-3 flex items-center justify-center gap-2.5">
                {currentTenant?.logo && (
                  <img
                    src={currentTenant.logo}
                    alt=""
                    className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )}
                <div className="text-left">
                  <div className="text-xs font-bold uppercase tracking-wider leading-tight">{currentTenant?.name}</div>
                  <div className="text-[9px] text-indigo-100 leading-tight">{currentTenant?.motto}</div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <img
                  src={selectedStudent.photoUrl}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover mx-auto border-2 border-slate-200 shadow-xs"
                />

                <div>
                  <div className="text-sm font-black text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </div>
                  <div className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
                    {selectedStudent.admissionNo}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-1">
                    {selectedStudent.gradeOrClass}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <div>Emergency Contact: {selectedStudent.guardianPhone}</div>
                  <div className="font-semibold text-slate-700 mt-0.5">Valid for Academic Year 2026</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={() => setIsIDCardModalOpen(false)}
                className="text-xs font-semibold text-slate-500"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ID Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onSelectStudent={(std) => {
          setSelectedStudent(std);
          setIsDetailModalOpen(true);
        }}
      />
    </div>
  );
};
