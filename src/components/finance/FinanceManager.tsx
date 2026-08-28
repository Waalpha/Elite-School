import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import type { Student, Invoice, Payment, FeeStructure } from "../../types";
import {
  subscribeToStudents,
  subscribeToInvoices,
  subscribeToPayments,
  subscribeToFeeStructures,
  saveInvoice,
  recordPayment,
  saveFeeStructure,
  deleteFeeStructure,
} from "../../services/firestoreService";
import {
  Receipt,
  Plus,
  Printer,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  X,
  Search,
  FileText,
  Calendar,
  Trash2,
  Layers,
} from "lucide-react";

export const FinanceManager: React.FC = () => {
  const { currentTenant, currentBranch, currentUser } = useTenant();

  const [activeTab, setActiveTab] = useState<"invoices" | "payments" | "structures">("payments");
  const [students, setStudents] = useState<Student[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  // Fee Structure Creation Modal
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [structureForm, setStructureForm] = useState({
    title: "Grade 1 - 2026 Term 1 Fees",
    gradeOrClass: "Grade 1",
    academicYear: "2026",
    termOrSemester: "Term 1",
    items: [
      { title: "Tuition & Faculty", amount: 25000 },
      { title: "CBC Learning Materials & Exams", amount: 5000 },
      { title: "Activity & Co-Curricular", amount: 3000 },
      { title: "School Lunch & Catering", amount: 5000 },
    ],
  });

  // Payment Recording Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    amount: 15000,
    paymentMethod: "M-Pesa" as "M-Pesa" | "Bank Transfer" | "Cash" | "Cheque" | "Credit Card",
    transactionRef: "QA789XTR4",
    notes: "Term 1 School Fees Payment",
  });

  // Invoice Modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    amount: 35000,
    dueDate: "2026-03-31",
    items: [
      { title: "Term 1 Tuition & CBC Facilitation", amount: 25000 },
      { title: "Learning Materials & Practical Activity", amount: 5000 },
      { title: "School Lunch & Co-Curricular", amount: 5000 },
    ],
  });

  useEffect(() => {
    if (!currentTenant) return;
    const unsubS = subscribeToStudents(currentTenant.id, setStudents, currentBranch?.id);
    const unsubI = subscribeToInvoices(currentTenant.id, setInvoices);
    const unsubP = subscribeToPayments(currentTenant.id, setPayments);
    const unsubF = subscribeToFeeStructures(currentTenant.id, setFeeStructures);

    return () => {
      unsubS();
      unsubI();
      unsubP();
      unsubF();
    };
  }, [currentTenant?.id, currentBranch?.id]);

  const currency = currentTenant?.currency || "KES";

  const totalBilled = students.reduce((sum, s) => sum + (s.totalFeeBilled || 0), 0);
  const totalCollected = students.reduce((sum, s) => sum + (s.totalFeePaid || 0), 0);
  const totalOutstanding = Math.max(0, totalBilled - totalCollected);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const student = students.find((s) => s.id === paymentForm.studentId);
    if (!student) {
      alert("Please select a valid student");
      return;
    }

    const receiptNo = "RCT-" + Math.floor(100000 + Math.random() * 900000);
    const payload: Payment = {
      id: "pay_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      receiptNumber: receiptNo,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      amount: Number(paymentForm.amount) || 0,
      paymentMethod: paymentForm.paymentMethod,
      transactionRef: paymentForm.transactionRef || "TX-" + Date.now(),
      paymentDate: new Date().toISOString().split("T")[0],
      recordedBy: currentUser.name,
      notes: paymentForm.notes,
      createdAt: new Date().toISOString(),
    };

    await recordPayment(currentTenant.id, payload, student, undefined, { name: currentUser.name });

    setSelectedPaymentForReceipt(payload);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const student = students.find((s) => s.id === invoiceForm.studentId);
    if (!student) return;

    const invTotal = invoiceForm.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);

    const payload: Invoice = {
      id: "inv_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      gradeOrClass: student.gradeOrClass,
      academicYear: "2026",
      term: "Term 1",
      amount: invTotal,
      paidAmount: 0,
      balance: invTotal,
      dueDate: invoiceForm.dueDate,
      items: invoiceForm.items,
      status: "unpaid",
      createdAt: new Date().toISOString(),
    };

    await saveInvoice(currentTenant.id, payload, { name: currentUser.name });
    setIsInvoiceModalOpen(false);
  };

  const handleSaveFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const total = structureForm.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const payload: FeeStructure = {
      id: "fee_str_" + Date.now(),
      tenantId: currentTenant.id,
      branchId: currentBranch?.id || "main",
      title: structureForm.title,
      educationLevel: currentTenant.type === "school_primary" ? "primary" : "college",
      gradeOrClass: structureForm.gradeOrClass,
      academicYear: structureForm.academicYear,
      termOrSemester: structureForm.termOrSemester,
      totalAmount: total,
      items: structureForm.items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveFeeStructure(currentTenant.id, payload, { name: currentUser.name });
    setIsStructureModalOpen(false);
  };

  const handleDeleteFeeStructure = async (structureId: string, title: string) => {
    if (!currentTenant) return;
    if (window.confirm(`Delete fee structure "${title}"?`)) {
      await deleteFeeStructure(currentTenant.id, structureId, { name: currentUser.name });
    }
  };

  const handleAddStructureItem = () => {
    setStructureForm((prev) => ({
      ...prev,
      items: [...prev.items, { title: "New Fee Votehead", amount: 2000 }],
    }));
  };

  const handleRemoveStructureItem = (index: number) => {
    setStructureForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>Fees, Invoicing & Financial Accounting</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student fee billing, multi-method payment receipting, automated ledger balances in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStructureModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>New Fee Structure</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (students.length > 0) setInvoiceForm((prev) => ({ ...prev, studentId: students[0].id }));
              setIsInvoiceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Student Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (students.length > 0) setPaymentForm((prev) => ({ ...prev, studentId: students[0].id }));
              setIsPaymentModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Receive Payment & Issue Receipt</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fees Invoiced</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currency} {totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all registered students</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Fees Collected</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {currency} {totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100}% Collection Rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outstanding Balances</div>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {currency} {totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            {students.filter((s) => (s.balance || 0) > 0).length} Unpaid Student Accounts
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "payments" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Payment Transactions & Receipts ({payments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "invoices" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Invoices & Statements ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("structures")}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === "structures" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Fee Structures & Vote Heads ({feeStructures.length})
        </button>
      </div>

      {/* PAYMENTS TAB */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Learner / Student</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Official Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">#{p.receiptNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.admissionNo}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{p.paymentMethod}</span>
                    <div className="text-[10px] text-slate-400 font-mono">{p.transactionRef}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{p.paymentDate}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {currency} {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentForReceipt(p);
                        setIsReceiptModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No fee payment transactions logged in Firestore yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inv.studentName}</td>
                  <td className="py-3.5 px-4">{inv.gradeOrClass}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{currency} {inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-700">{currency} {inv.balance.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No invoices generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FEE STRUCTURES TAB */}
      {activeTab === "structures" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institutional Fee Structures & Vote-Heads</h3>
              <p className="text-xs text-slate-500">
                Configure grade-specific, termly billing schedules, tuition rates, and itemized voteheads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsStructureModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Fee Structure</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map((fs) => (
              <div
                key={fs.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                        {fs.gradeOrClass} • {fs.academicYear} {fs.termOrSemester}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{fs.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFeeStructure(fs.id, fs.title)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title="Delete Fee Structure"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Itemized Breakdown
                    </div>
                    {fs.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-600">
                        <span className="truncate max-w-[180px]">{it.title}</span>
                        <span className="font-semibold text-slate-900">
                          {currency} {it.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Billed:</span>
                  <span className="text-base font-black text-indigo-700">
                    {currency} {fs.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {feeStructures.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                No fee structures created yet. Click "Create Fee Structure" to define tuition rates.
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Record Student Fee Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  required
                  value={paymentForm.studentId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) - Balance: {currency} {s.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Amount to Pay ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-extrabold text-emerald-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentMethod: e.target.value as "M-Pesa" | "Bank Transfer" | "Cash" | "Cheque",
                      })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="M-Pesa">M-Pesa Paybill / Till</option>
                    <option value="Bank Transfer">Bank Transfer / Deposit</option>
                    <option value="Cash">Cash at Bursar Office</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Transaction Ref / Cheque #</label>
                  <input
                    type="text"
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                    placeholder="e.g. QK890TY45"
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Notes / Description</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md"
                >
                  Submit & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Issue Fee Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Student *</label>
                <select
                  required
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) - {s.gradeOrClass}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="font-bold text-slate-700">Invoice Items Breakdown</div>
                {invoiceForm.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="text-slate-600">{it.title}</span>
                    <span className="font-bold">{currency} {it.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL RECEIPT MODAL */}
      {isReceiptModalOpen && selectedPaymentForReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 print:p-0 print:border-none print:shadow-none">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 print:hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Official Payment Receipt</h3>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Card */}
            <div className="mt-3 p-5 border-2 border-dashed border-slate-400 rounded-xl bg-white space-y-4">
              <div className="text-center pb-3 border-b border-slate-200">
                <div className="text-sm font-black uppercase">{currentTenant?.name}</div>
                <div className="text-[10px] text-slate-500">{currentTenant?.address} • Tel: {currentTenant?.phone}</div>
                <div className="inline-block mt-2 px-3 py-0.5 rounded bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                  OFFICIAL FEE RECEIPT
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Receipt No:</div>
                  <div className="font-mono font-bold text-emerald-800">#{selectedPaymentForReceipt.receiptNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Date:</div>
                  <div className="font-semibold text-slate-700">{selectedPaymentForReceipt.paymentDate}</div>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-50 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Received From:</span>
                  <span className="font-bold text-slate-900">{selectedPaymentForReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono font-semibold text-indigo-700">{selectedPaymentForReceipt.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-semibold">{selectedPaymentForReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono">{selectedPaymentForReceipt.transactionRef}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950">
                <span className="font-bold text-xs">Amount Paid:</span>
                <span className="font-black text-base">{currency} {selectedPaymentForReceipt.amount.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
                <span>Issued by: {selectedPaymentForReceipt.recordedBy}</span>
                <span className="italic font-serif">Verified & Signed</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 print:hidden">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-xs font-semibold text-slate-500"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FEE STRUCTURE MODAL */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Define New Institutional Fee Structure</h3>
              <button
                onClick={() => setIsStructureModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeeStructure} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Fee Structure Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 1 - 2026 Term 1 Fees"
                  value={structureForm.title}
                  onChange={(e) => setStructureForm({ ...structureForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class / Grade *</label>
                  <input
                    type="text"
                    required
                    value={structureForm.gradeOrClass}
                    onChange={(e) =>
                      setStructureForm({ ...structureForm, gradeOrClass: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={structureForm.academicYear}
                    onChange={(e) =>
                      setStructureForm({ ...structureForm, academicYear: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Term / Semester *</label>
                  <select
                    value={structureForm.termOrSemester}
                    onChange={(e) =>
                      setStructureForm({ ...structureForm, termOrSemester: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Voteheads / Line Items */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Itemized Fee Voteheads</span>
                  <button
                    type="button"
                    onClick={handleAddStructureItem}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {structureForm.items.map((it, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Votehead Name"
                        value={it.title}
                        onChange={(e) => {
                          const next = [...structureForm.items];
                          next[idx].title = e.target.value;
                          setStructureForm({ ...structureForm, items: next });
                        }}
                        className="flex-1 p-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <div className="w-28 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                          {currency}
                        </span>
                        <input
                          type="number"
                          required
                          min={0}
                          value={it.amount}
                          onChange={(e) => {
                            const next = [...structureForm.items];
                            next[idx].amount = Number(e.target.value) || 0;
                            setStructureForm({ ...structureForm, items: next });
                          }}
                          className="w-full pl-9 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white text-right font-mono"
                        />
                      </div>
                      {structureForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStructureItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Total Calculation:</span>
                  <span className="font-black text-indigo-700 text-sm">
                    {currency}{" "}
                    {structureForm.items
                      .reduce((sum, it) => sum + (Number(it.amount) || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStructureModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md"
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
