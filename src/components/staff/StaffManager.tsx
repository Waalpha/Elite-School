import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Staff } from "../../types";
import { QRScannerModal } from "../common/QRScannerModal";
import {
  subscribeToStaff,
  saveStaff,
  deleteStaff,
} from "../../services/firestoreService";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
  DollarSign,
  UserCheck,
  X,
  Search,
  QrCode,
} from "lucide-react";

export const StaffManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    staffNo: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "Teaching Faculty",
    designation: "Class Teacher",
    role: "teacher",
    salary: 65000,
    status: "active",
  });

  useEffect(() => {
    if (!currentTenant) return;
    const unsub = subscribeToStaff(currentTenant.id, setStaffList);
    return () => unsub();
  }, [currentTenant?.id]);

  const currency = currentTenant?.currency || "KES";

  const handleOpenAdd = () => {
    setFormData({
      id: "stf_" + Date.now(),
      staffNo: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      firstName: "",
      lastName: "",
      email: "",
      phone: "+254 700 000 000",
      department: "Teaching Faculty",
      designation: "Teacher / Lecturer",
      role: "teacher",
      salary: 65000,
      status: "active",
    });
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: Staff) => {
    setSelectedStaff(st);
    setFormData({ ...st });
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId: string, name: string) => {
    if (!currentTenant) return;
    await deleteStaff(currentTenant.id, staffId, { name: currentUser.name });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const payload: Staff = {
      id: formData.id || "stf_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      staffNo: formData.staffNo || "EMP-" + Date.now(),
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      department: formData.department || "General Staff",
      designation: formData.designation || "Staff",
      role: formData.role || "teacher",
      employmentType: "full_time",
      salary: Number(formData.salary) || 0,
      status: (formData.status as "active" | "on_leave" | "terminated") || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStaff(currentTenant.id, payload, { name: currentUser.name });
    setIsModalOpen(false);
  };

  const filteredStaff = staffList.filter((st) => {
    const full = `${st.firstName} ${st.lastName} ${st.staffNo} ${st.department} ${st.designation}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Educators, Faculty & Staff HR Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teacher profiles, department assignments, salary structures, and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQRScannerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors shrink-0"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>Scan Staff QR</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff / Educator</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, employee number, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-100">
                    {st.firstName[0]}
                    {st.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {st.firstName} {st.lastName}
                    </h3>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50/70 px-1.5 py-0.5 rounded">
                      {st.staffNo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(st)}
                    className="text-slate-400 hover:text-indigo-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    title="Edit Staff Member"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(st.id, `${st.firstName} ${st.lastName}`)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                    title="Delete Staff Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation:</span>
                  <span className="font-semibold text-slate-900">{st.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span>{st.department}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{st.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                Salary: {currency} {st.salary?.toLocaleString() || "N/A"}
              </span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                {st.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Educator / Staff Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Employee Number</label>
                  <input
                    type="text"
                    value={formData.staffNo}
                    onChange={(e) => setFormData({ ...formData, staffNo: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Monthly Salary ({currency})</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Class Teacher"
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
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
                  Save Educator Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};
