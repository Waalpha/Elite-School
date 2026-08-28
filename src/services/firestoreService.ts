import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { compressImageToDataUrl, dataUrlToFile } from "../utils/imageUtils";
import type {
  Tenant,
  Branch,
  TenantUser,
  Student,
  Staff,
  AcademicClass,
  Subject,
  Course,
  Department,
  AcademicYear,
  FeeStructure,
  Invoice,
  Payment,
  Assessment,
  DailyAttendance,
  AttendanceRecord,
  Timetable,
  Certificate,
  TenantWebsiteConfig,
  AuditLog,
  PublicInquiry,
  PlatformConfig,
  PlatformFeature,
  PlatformPlan,
  PlatformTestimonial,
} from "../types";

// ==========================================
// 1. TENANT MANAGEMENT
// ==========================================

export async function getTenants(): Promise<Tenant[]> {
  const colRef = collection(db, "tenants");
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tenant));
}

export function subscribeToTenants(callback: (tenants: Tenant[]) => void): Unsubscribe {
  const colRef = collection(db, "tenants");
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Tenant));
      callback(list);
    },
    (err) => {
      console.warn("Firestore subscribeToTenants error:", err);
    }
  );
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  if (!tenantId) return null;
  const docRef = doc(db, "tenants", tenantId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Tenant;
}

export async function saveTenant(tenant: Tenant, userDetails?: { name: string; email: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenant.id);
  const payload = {
    ...tenant,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, payload, { merge: true });

  await logAuditEvent({
    tenantId: tenant.id,
    userName: userDetails?.name || "System Admin",
    userEmail: userDetails?.email,
    action: "SAVED_TENANT",
    module: "PLATFORM_ADMIN",
    recordId: tenant.id,
    details: `Configured tenant: ${tenant.name} (${tenant.code})`,
  });
}

export async function deleteTenant(tenantId: string, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId);
  await deleteDoc(docRef);
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "System Admin",
    action: "DELETED_TENANT",
    module: "PLATFORM_ADMIN",
    recordId: tenantId,
    details: `Deleted tenant ${tenantId}`,
  });
}

// ==========================================
// 2. BRANCHES
// ==========================================

export function subscribeToBranches(tenantId: string, callback: (branches: Branch[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "branches");
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Branch));
      callback(list);
    },
    (err) => console.warn("Branches sub error:", err)
  );
}

export async function saveBranch(tenantId: string, branch: Branch, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "branches", branch.id);
  await setDoc(docRef, branch, { merge: true });

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Branch Admin",
    action: "SAVED_BRANCH",
    module: "BRANCH_MANAGEMENT",
    recordId: branch.id,
    details: `Configured campus branch ${branch.name} (${branch.code})`,
  });
}

// ==========================================
// 3. STUDENTS (PRE-PRIMARY, PRIMARY, JUNIOR, TVET/COLLEGE)
// ==========================================

export function subscribeToStudents(
  tenantId: string,
  callback: (students: Student[]) => void,
  branchId?: string
): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "students");
  return onSnapshot(
    colRef,
    (snap) => {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Student));
      if (branchId && branchId !== "all") {
        list = list.filter((s) => !s.branchId || s.branchId === branchId);
      }
      callback(list);
    },
    (err) => console.warn("Students sub error:", err)
  );
}

export async function saveStudent(tenantId: string, student: Student, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "students", student.id);
  const data = {
    ...student,
    tenantId,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, data, { merge: true });

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Officer",
    action: "SAVED_STUDENT",
    module: "STUDENTS_ADMISSIONS",
    recordId: student.id,
    details: `Saved student profile for ${student.firstName} ${student.lastName} (${student.admissionNo}) - ${student.gradeOrClass}`,
  });
}

export async function deleteStudent(tenantId: string, studentId: string, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "students", studentId);
  await deleteDoc(docRef);
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Officer",
    action: "DELETED_STUDENT",
    module: "STUDENTS_ADMISSIONS",
    recordId: studentId,
    details: `Deleted student record ${studentId}`,
  });
}

// ==========================================
// 4. STAFF & HR
// ==========================================

export function subscribeToStaff(tenantId: string, callback: (staff: Staff[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "staff");
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Staff));
      callback(list);
    },
    (err) => console.warn("Staff sub error:", err)
  );
}

export async function saveStaff(tenantId: string, staff: Staff, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "staff", staff.id);
  await setDoc(docRef, { ...staff, tenantId, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteStaff(tenantId: string, staffId: string, userDetails?: { name: string }): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "staff", staffId);
  await deleteDoc(docRef);

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "HR Admin",
    action: "DELETED_STAFF",
    module: "STAFF_HR",
    recordId: staffId,
    details: `Removed staff record ${staffId}`,
  });
}

// ==========================================
// 5. CLASSES, SUBJECTS, COURSES & ACADEMIC YEARS
// ==========================================

export function subscribeToClasses(tenantId: string, callback: (classes: AcademicClass[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "classes");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicClass)));
    },
    (err) => console.warn("Classes sub error:", err)
  );
}

export async function saveClass(tenantId: string, academicClass: AcademicClass): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "classes", academicClass.id);
  await setDoc(docRef, { ...academicClass, tenantId }, { merge: true });
}

export async function deleteClass(tenantId: string, classId: string): Promise<void> {
  await deleteDoc(doc(db, "tenants", tenantId, "classes", classId));
}

export function subscribeToSubjects(tenantId: string, callback: (subjects: Subject[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "subjects");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subject)));
    },
    (err) => console.warn("Subjects sub error:", err)
  );
}

export async function saveSubject(tenantId: string, subject: Subject): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "subjects", subject.id), { ...subject, tenantId }, { merge: true });
}

export async function deleteSubject(tenantId: string, subjectId: string): Promise<void> {
  await deleteDoc(doc(db, "tenants", tenantId, "subjects", subjectId));
}

export function subscribeToCourses(tenantId: string, callback: (courses: Course[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "courses");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course)));
    },
    (err) => console.warn("Courses sub error:", err)
  );
}

export async function saveCourse(tenantId: string, course: Course): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "courses", course.id), { ...course, tenantId }, { merge: true });
}

export async function deleteCourse(tenantId: string, courseId: string): Promise<void> {
  await deleteDoc(doc(db, "tenants", tenantId, "courses", courseId));
}

export function subscribeToAcademicYears(tenantId: string, callback: (years: AcademicYear[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "academic_years");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicYear)));
    },
    (err) => console.warn("AcademicYears sub error:", err)
  );
}

export async function saveAcademicYear(tenantId: string, year: AcademicYear): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "academic_years", year.id), { ...year, tenantId }, { merge: true });
}

// ==========================================
// 6. FEES, INVOICES & PAYMENTS
// ==========================================

export function subscribeToFeeStructures(tenantId: string, callback: (fees: FeeStructure[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "fee_structures");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeeStructure)));
    },
    (err) => console.warn("FeeStructures sub error:", err)
  );
}

export async function saveFeeStructure(tenantId: string, fee: FeeStructure, userDetails?: { name: string }): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "fee_structures", fee.id), { ...fee, tenantId }, { merge: true });
  if (userDetails) {
    await logAuditEvent({
      tenantId,
      userName: userDetails.name,
      action: "SAVED_FEE_STRUCTURE",
      module: "FINANCE_FEES",
      recordId: fee.id,
      details: `Saved fee structure ${fee.title || fee.id} of amount ${fee.totalAmount}`,
    });
  }
}

export async function deleteFeeStructure(tenantId: string, feeStructureId: string, userDetails?: { name: string }): Promise<void> {
  await deleteDoc(doc(db, "tenants", tenantId, "fee_structures", feeStructureId));
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Finance Admin",
    action: "DELETED_FEE_STRUCTURE",
    module: "FINANCE_FEES",
    recordId: feeStructureId,
    details: `Removed fee structure configuration ${feeStructureId}`,
  });
}

export function subscribeToInvoices(tenantId: string, callback: (invoices: Invoice[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "invoices");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invoice)));
    },
    (err) => console.warn("Invoices sub error:", err)
  );
}

export async function saveInvoice(tenantId: string, invoice: Invoice, userDetails?: { name: string }): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "invoices", invoice.id), { ...invoice, tenantId }, { merge: true });
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Accountant",
    action: "ISSUED_INVOICE",
    module: "FINANCE_FEES",
    recordId: invoice.id,
    details: `Issued invoice ${invoice.invoiceNumber} for ${invoice.studentName} amount: ${invoice.amount}`,
  });
}

export function subscribeToPayments(tenantId: string, callback: (payments: Payment[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "payments");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
    },
    (err) => console.warn("Payments sub error:", err)
  );
}

export async function recordPayment(
  tenantId: string,
  payment: Payment,
  student: Student,
  invoice?: Invoice,
  userDetails?: { name: string }
): Promise<void> {
  // 1. Save payment record
  const payRef = doc(db, "tenants", tenantId, "payments", payment.id);
  await setDoc(payRef, { ...payment, tenantId }, { merge: true });

  // 2. Update Student Fee Balances
  const newPaid = (student.totalFeePaid || 0) + payment.amount;
  const newBalance = Math.max(0, (student.totalFeeBilled || 0) - newPaid);
  const studentRef = doc(db, "tenants", tenantId, "students", student.id);
  await updateDoc(studentRef, {
    totalFeePaid: newPaid,
    balance: newBalance,
    updatedAt: new Date().toISOString(),
  });

  // 3. Update Invoice if linked
  if (invoice) {
    const invPaid = (invoice.paidAmount || 0) + payment.amount;
    const invBal = Math.max(0, invoice.amount - invPaid);
    const invStatus = invBal === 0 ? "paid" : invPaid > 0 ? "partial" : "unpaid";
    await updateDoc(doc(db, "tenants", tenantId, "invoices", invoice.id), {
      paidAmount: invPaid,
      balance: invBal,
      status: invStatus,
    });
  }

  // 4. Audit Log
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Cashier",
    action: "RECORDED_PAYMENT",
    module: "FINANCE_FEES",
    recordId: payment.id,
    details: `Received ${payment.amount} via ${payment.paymentMethod} (Receipt #${payment.receiptNumber}) for student ${student.firstName} ${student.lastName}`,
  });
}

// ==========================================
// 7. ASSESSMENTS, EXAMS & CBC COMPETENCIES
// ==========================================

export function subscribeToAssessments(tenantId: string, callback: (assessments: Assessment[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "assessments");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Assessment)));
    },
    (err) => console.warn("Assessments sub error:", err)
  );
}

export async function saveAssessment(tenantId: string, assessment: Assessment, userDetails?: { name: string }): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "assessments", assessment.id), { ...assessment, tenantId }, { merge: true });
  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Teacher",
    action: "SAVED_ASSESSMENT",
    module: "EXAMS_ACADEMICS",
    recordId: assessment.id,
    details: `Updated assessment marks for ${assessment.title} - ${assessment.subjectName} (${assessment.grade})`,
  });
}

// ==========================================
// 8. ATTENDANCE & TIMETABLES
// ==========================================

export function subscribeToAttendance(
  tenantId: string,
  callback: (records: AttendanceRecord[]) => void,
  dateFilter?: string
): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "attendance_records");
  return onSnapshot(
    colRef,
    (snap) => {
      let records = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord));
      if (dateFilter) {
        records = records.filter((r) => r.date === dateFilter);
      }
      callback(records);
    },
    (err) => console.warn("Attendance sub error:", err)
  );
}

export async function saveAttendanceRecord(
  tenantId: string,
  record: AttendanceRecord,
  userDetails?: { name: string }
): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "attendance_records", record.id);
  await setDoc(docRef, { ...record, tenantId }, { merge: true });

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Teacher",
    action: "RECORDED_ATTENDANCE",
    module: "ATTENDANCE",
    recordId: record.id,
    details: `Marked ${record.studentName} as ${record.status.toUpperCase()} for date ${record.date}`,
  });
}

export function subscribeToDailyAttendance(tenantId: string, callback: (att: DailyAttendance[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "attendance");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DailyAttendance)));
    },
    (err) => console.warn("DailyAttendance sub error:", err)
  );
}

export async function saveDailyAttendance(tenantId: string, att: DailyAttendance): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "attendance", att.id), { ...att, tenantId }, { merge: true });
}

export function subscribeToTimetables(tenantId: string, callback: (tt: Timetable[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "timetables");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Timetable)));
    },
    (err) => console.warn("Timetables sub error:", err)
  );
}

export async function saveTimetable(tenantId: string, tt: Timetable): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "timetables", tt.id), { ...tt, tenantId }, { merge: true });
}

// ==========================================
// 9. CERTIFICATES & GRADUATION
// ==========================================

export function subscribeToCertificates(tenantId: string, callback: (certs: Certificate[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  const colRef = collection(db, "tenants", tenantId, "certificates");
  return onSnapshot(
    colRef,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate)));
    },
    (err) => console.warn("Certificates sub error:", err)
  );
}

export async function saveCertificate(tenantId: string, cert: Certificate): Promise<void> {
  await setDoc(doc(db, "tenants", tenantId, "certificates", cert.id), { ...cert, tenantId }, { merge: true });
}

export async function issueCertificate(
  tenantId: string,
  cert: Certificate,
  userDetails?: { name: string }
): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "certificates", cert.id);
  await setDoc(docRef, { ...cert, tenantId }, { merge: true });

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "Registrar",
    action: "ISSUED_CERTIFICATE",
    module: "GRADUATION_CERTS",
    recordId: cert.id,
    details: `Issued ${cert.title} (#${cert.certificateNumber || cert.certNumber || cert.id}) to ${cert.studentName}`,
  });
}

// ==========================================
// 10. TENANT WEBSITE CMS CONFIGURATION
// ==========================================

export function subscribeToTenantWebsite(
  tenantId: string,
  callback: (config: TenantWebsiteConfig | null) => void
): Unsubscribe {
  if (!tenantId) return () => {};
  const docRef = doc(db, "tenants", tenantId, "website_config", "main");
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as TenantWebsiteConfig);
      } else {
        callback(null);
      }
    },
    (err) => console.warn("TenantWebsite sub error:", err)
  );
}

export const subscribeToWebsiteConfig = subscribeToTenantWebsite;

export async function getTenantWebsite(tenantId: string): Promise<TenantWebsiteConfig | null> {
  if (!tenantId) return null;
  const docRef = doc(db, "tenants", tenantId, "website_config", "main");
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as TenantWebsiteConfig;
}

export const getWebsiteConfig = getTenantWebsite;

export async function saveTenantWebsite(
  tenantId: string,
  config: TenantWebsiteConfig,
  userDetails?: { name: string }
): Promise<void> {
  const docRef = doc(db, "tenants", tenantId, "website_config", "main");
  const payload = {
    ...config,
    tenantId,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, payload, { merge: true });

  await logAuditEvent({
    tenantId,
    userName: userDetails?.name || "CMS Admin",
    action: "UPDATED_WEBSITE_CMS",
    module: "TENANT_WEBSITE",
    recordId: "main",
    details: `Updated public website theme, hero slides, and admissions status for ${config.heroHeadline || config.title || config.tenantId}`,
  });
}

export const saveWebsiteConfig = saveTenantWebsite;

// ==========================================
// 11. PUBLIC INQUIRIES & AUDIT LOGS
// ==========================================

export async function submitPublicInquiry(inquiry: PublicInquiry): Promise<void> {
  const docRef = doc(db, "public_inquiries", inquiry.id);
  await setDoc(docRef, inquiry);
}

export function subscribeToAuditLogs(tenantId: string | "all", callback: (logs: AuditLog[]) => void): Unsubscribe {
  if (!tenantId) return () => {};
  if (tenantId === "all") {
    // platform-wide logs
    const colRef = collection(db, "platform_audit_logs");
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLog));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(list);
      },
      (err) => console.warn("Platform audit logs sub error:", err)
    );
  }

  const colRef = collection(db, "tenants", tenantId, "audit_logs");
  return onSnapshot(
    colRef,
    (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLog));
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    },
    (err) => console.warn("Tenant audit logs sub error:", err)
  );
}

export async function logAuditEvent(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
  try {
    const id = "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const payload: AuditLog = {
      ...log,
      id,
      timestamp: new Date().toISOString(),
    };

    if (log.tenantId) {
      const docRef = doc(db, "tenants", log.tenantId, "audit_logs", id);
      await setDoc(docRef, payload);
    }

    // Also copy to platform audit log
    const platDocRef = doc(db, "platform_audit_logs", id);
    await setDoc(platDocRef, payload);
  } catch (err) {
    console.warn("Audit log writing warning:", err);
  }
}

// ==========================================
// 12. STORAGE FILE UPLOADS
// ==========================================

export async function uploadFileToStorage(
  tenantId: string,
  pathFolder: string,
  file: File
): Promise<string> {
  // 1. If image file, compress to high-quality lightweight data URL first
  let compressedDataUrl = "";
  let fileToUpload = file;

  if (file.type.startsWith("image/")) {
    try {
      const isBanner = pathFolder.includes("slide") || pathFolder.includes("hero") || pathFolder.includes("gallery");
      compressedDataUrl = await compressImageToDataUrl(file, {
        maxWidth: isBanner ? 1280 : 400,
        maxHeight: isBanner ? 720 : 400,
        quality: 0.85,
        mimeType: file.type.includes("png") ? "image/png" : "image/jpeg",
      });
      fileToUpload = dataUrlToFile(compressedDataUrl, file.name);
    } catch (compErr) {
      console.warn("Image pre-compression warning:", compErr);
    }
  }

  // 2. Try Firebase Storage upload
  try {
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storageReference = ref(storage, `tenants/${tenantId}/${pathFolder}/${safeName}`);
    await uploadBytes(storageReference, fileToUpload);
    const downloadUrl = await getDownloadURL(storageReference);
    return downloadUrl;
  } catch (error) {
    console.warn("Storage upload fallback to compressed Data URL:", error);
    if (compressedDataUrl) {
      return compressedDataUrl;
    }
    // Fallback: convert to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

// ==========================================
// 13. SEEDING / INITIAL PROVISIONING
// ==========================================

export async function checkAndSeedInitialTenants(): Promise<void> {
  try {
    const existing = await getTenants();
    if (existing.length > 0) {
      return; // Already initialized in Firestore
    }

    console.log("Seeding initial flagship tenants into Firestore...");

    // Flagship Tenant 1: BREAKTHROUGH INTERNATIONAL TRAINING COLLEGE
    const bitcTenant: Tenant = {
      id: "bitc-college",
      name: "Breakthrough International Training College",
      type: "college_tvet",
      code: "BITC",
      logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80",
      email: "info@breakthroughcollege.ac.ke",
      phone: "+254 700 123 456",
      address: "Moi Avenue, City Centre Plaza, Nairobi, Kenya",
      website: "https://breakthroughcollege.ac.ke",
      country: "Kenya",
      status: "active",
      subscriptionPlan: "enterprise",
      currency: "KES",
      primaryColor: "#0284c7", // Sky blue
      motto: "Empowering Next-Generation Professionals",
      subdomain: "bitc",
      customDomain: "portal.breakthroughcollege.ac.ke",
      enabledModules: [
        "education",
        "admissions",
        "courses",
        "fees",
        "accounting",
        "exams",
        "transcripts",
        "attendance",
        "timetable",
        "hr",
        "certificates",
        "website",
        "reports",
        "documents",
        "branches",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Flagship Tenant 2: ST. AUSTIN PRE-PRIMARY & PRIMARY SCHOOL (CBC Playgroup to Grade 9)
    const stAustinTenant: Tenant = {
      id: "st-austin-academy",
      name: "St. Austin Pre-Primary & Junior Secondary School",
      type: "school_primary",
      code: "SAJA",
      logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80",
      email: "admissions@staustin.edu",
      phone: "+254 722 987 654",
      address: "Academy Road, Lavington, Nairobi, Kenya",
      website: "https://staustin.edu",
      country: "Kenya",
      status: "active",
      subscriptionPlan: "enterprise",
      currency: "KES",
      primaryColor: "#059669", // Emerald
      motto: "Nurturing Every Learner's Potential with Excellence",
      subdomain: "staustin",
      customDomain: "portal.staustin.edu",
      enabledModules: [
        "education",
        "primary_cbc",
        "junior_school",
        "admissions",
        "classes",
        "fees",
        "accounting",
        "exams",
        "cbc_assessments",
        "report_cards",
        "attendance",
        "timetable",
        "hr",
        "parent_portal",
        "certificates",
        "website",
        "reports",
        "branches",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save Tenants
    await setDoc(doc(db, "tenants", bitcTenant.id), bitcTenant);
    await setDoc(doc(db, "tenants", stAustinTenant.id), stAustinTenant);

    // Seed BITC Branches
    const bitcMainBranch: Branch = {
      id: "bitc_main",
      tenantId: "bitc-college",
      name: "Main Campus - Nairobi CBD",
      code: "CBD",
      isMain: true,
      address: "City Centre Plaza, Nairobi",
      phone: "+254 700 123 456",
      email: "cbd@breakthroughcollege.ac.ke",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const bitcNyeriBranch: Branch = {
      id: "bitc_nyeri",
      tenantId: "bitc-college",
      name: "Nyeri Branch Campus",
      code: "NYR",
      isMain: false,
      address: "Kimathi Way, Nyeri",
      phone: "+254 711 445 566",
      email: "nyeri@breakthroughcollege.ac.ke",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "bitc-college", "branches", bitcMainBranch.id), bitcMainBranch);
    await setDoc(doc(db, "tenants", "bitc-college", "branches", bitcNyeriBranch.id), bitcNyeriBranch);

    // Seed St Austin Branches
    const saMainBranch: Branch = {
      id: "sa_main",
      tenantId: "st-austin-academy",
      name: "Main Campus (Pre-Primary & Primary)",
      code: "MAIN",
      isMain: true,
      address: "Lavington Campus, Nairobi",
      phone: "+254 722 987 654",
      email: "lavington@staustin.edu",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const saJuniorBranch: Branch = {
      id: "sa_junior",
      tenantId: "st-austin-academy",
      name: "Junior Secondary School Wing (Grade 7 - 9)",
      code: "JSS",
      isMain: false,
      address: "Riverside Campus, Nairobi",
      phone: "+254 733 112 233",
      email: "jss@staustin.edu",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "st-austin-academy", "branches", saMainBranch.id), saMainBranch);
    await setDoc(doc(db, "tenants", "st-austin-academy", "branches", saJuniorBranch.id), saJuniorBranch);

    // Seed BITC Academic Year & Departments & Courses
    const bitcYear: AcademicYear = {
      id: "ay_2026",
      tenantId: "bitc-college",
      year: "2026",
      terms: [
        { term: "Semester 1 (Jan - Apr)", startDate: "2026-01-06", endDate: "2026-04-24" },
        { term: "Semester 2 (May - Aug)", startDate: "2026-05-04", endDate: "2026-08-28" },
        { term: "Semester 3 (Sep - Dec)", startDate: "2026-09-07", endDate: "2026-12-18" },
      ],
      isCurrent: true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "bitc-college", "academic_years", bitcYear.id), bitcYear);

    const bitcCourses: Course[] = [
      {
        id: "c_dit",
        tenantId: "bitc-college",
        code: "DIT-101",
        title: "Diploma in Information Communication Technology",
        department: "School of Computing & IT",
        level: "Diploma",
        duration: "2 Years (6 Semesters)",
        feePerTerm: 28000,
        description: "Comprehensive software engineering, networking, database administration, and cyber security.",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c_bba",
        tenantId: "bitc-college",
        code: "DBA-201",
        title: "Diploma in Business Administration & Management",
        department: "School of Business",
        level: "Diploma",
        duration: "2 Years (6 Semesters)",
        feePerTerm: 25000,
        description: "Enterprise management, human resources, financial management, and marketing.",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c_cpa",
        tenantId: "bitc-college",
        code: "ACC-301",
        title: "Certified Public Accountants (CPA Foundation & Intermediate)",
        department: "School of Accounting",
        level: "Professional Certificate",
        duration: "1.5 Years",
        feePerTerm: 22000,
        description: "Professional accounting, taxation, auditing, and corporate finance certification.",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];
    for (const c of bitcCourses) {
      await setDoc(doc(db, "tenants", "bitc-college", "courses", c.id), c);
    }

    // Seed St. Austin Classes (Playgroup through Grade 9)
    const saYear: AcademicYear = {
      id: "ay_2026_sa",
      tenantId: "st-austin-academy",
      year: "2026",
      terms: [
        { term: "Term 1", startDate: "2026-01-05", endDate: "2026-04-03" },
        { term: "Term 2", startDate: "2026-05-04", endDate: "2026-08-07" },
        { term: "Term 3", startDate: "2026-08-31", endDate: "2026-11-20" },
      ],
      isCurrent: true,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "st-austin-academy", "academic_years", saYear.id), saYear);

    const saClasses: AcademicClass[] = [
      { id: "cls_pp1", tenantId: "st-austin-academy", branchId: "sa_main", name: "PP1 Sunflowers", educationLevel: "pre_primary", grade: "PP1", stream: "Sunflowers", classTeacherName: "Teacher Grace Njeri", academicYear: "2026", term: "Term 1", capacity: 25, room: "Block A - Room 1", createdAt: new Date().toISOString() },
      { id: "cls_pp2", tenantId: "st-austin-academy", branchId: "sa_main", name: "PP2 Butterflies", educationLevel: "pre_primary", grade: "PP2", stream: "Butterflies", classTeacherName: "Teacher Mary Wambui", academicYear: "2026", term: "Term 1", capacity: 25, room: "Block A - Room 2", createdAt: new Date().toISOString() },
      { id: "cls_g1", tenantId: "st-austin-academy", branchId: "sa_main", name: "Grade 1 Blue", educationLevel: "primary", grade: "Grade 1", stream: "Blue", classTeacherName: "Teacher John Otieno", academicYear: "2026", term: "Term 1", capacity: 30, room: "Block B - Room 101", createdAt: new Date().toISOString() },
      { id: "cls_g3", tenantId: "st-austin-academy", branchId: "sa_main", name: "Grade 3 Gold", educationLevel: "primary", grade: "Grade 3", stream: "Gold", classTeacherName: "Teacher Samuel Kiprono", academicYear: "2026", term: "Term 1", capacity: 30, room: "Block B - Room 103", createdAt: new Date().toISOString() },
      { id: "cls_g4", tenantId: "st-austin-academy", branchId: "sa_main", name: "Grade 4 East", educationLevel: "primary", grade: "Grade 4", stream: "East", classTeacherName: "Teacher Sarah Mwangi", academicYear: "2026", term: "Term 1", capacity: 30, room: "Block C - Room 201", createdAt: new Date().toISOString() },
      { id: "cls_g6", tenantId: "st-austin-academy", branchId: "sa_main", name: "Grade 6 Eagles", educationLevel: "primary", grade: "Grade 6", stream: "Eagles", classTeacherName: "Teacher David Karanja", academicYear: "2026", term: "Term 1", capacity: 32, room: "Block C - Room 203", createdAt: new Date().toISOString() },
      { id: "cls_g7", tenantId: "st-austin-academy", branchId: "sa_junior", name: "Grade 7 Alpha (Junior School)", educationLevel: "junior_school", grade: "Grade 7", stream: "Alpha", classTeacherName: "Tr. Benson Ndung'u", academicYear: "2026", term: "Term 1", capacity: 35, room: "Junior Wing - J1", createdAt: new Date().toISOString() },
      { id: "cls_g8", tenantId: "st-austin-academy", branchId: "sa_junior", name: "Grade 8 Beta (Junior School)", educationLevel: "junior_school", grade: "Grade 8", stream: "Beta", classTeacherName: "Tr. Faith Chebet", academicYear: "2026", term: "Term 1", capacity: 35, room: "Junior Wing - J2", createdAt: new Date().toISOString() },
      { id: "cls_g9", tenantId: "st-austin-academy", branchId: "sa_junior", name: "Grade 9 Pioneer (Junior School)", educationLevel: "junior_school", grade: "Grade 9", stream: "Pioneer", classTeacherName: "Tr. Peter Mutua", academicYear: "2026", term: "Term 1", capacity: 35, room: "Junior Wing - J3", createdAt: new Date().toISOString() },
    ];
    for (const cl of saClasses) {
      await setDoc(doc(db, "tenants", "st-austin-academy", "classes", cl.id), cl);
    }

    // Seed CBC Subjects
    const saSubjects: Subject[] = [
      { id: "sub_math", tenantId: "st-austin-academy", code: "MAT-CBC", name: "Mathematics Activities", educationLevel: "primary", gradeLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_eng", tenantId: "st-austin-academy", code: "ENG-CBC", name: "English Language Activities", educationLevel: "primary", gradeLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_kisw", tenantId: "st-austin-academy", code: "KIS-CBC", name: "Kiswahili Lugha & Kusoma", educationLevel: "primary", gradeLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_sci", tenantId: "st-austin-academy", code: "SCI-CBC", name: "Science & Technology", educationLevel: "primary", gradeLevels: ["Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_agri", tenantId: "st-austin-academy", code: "AGR-CBC", name: "Agriculture & Nutrition", educationLevel: "primary", gradeLevels: ["Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_ss", tenantId: "st-austin-academy", code: "SST-CBC", name: "Social Studies & CRE", educationLevel: "primary", gradeLevels: ["Grade 4", "Grade 5", "Grade 6"], createdAt: new Date().toISOString() },
      { id: "sub_pre_tech", tenantId: "st-austin-academy", code: "PTS-JSS", name: "Pre-Technical Studies", educationLevel: "junior_school", gradeLevels: ["Grade 7", "Grade 8", "Grade 9"], createdAt: new Date().toISOString() },
      { id: "sub_int_sci", tenantId: "st-austin-academy", code: "ISC-JSS", name: "Integrated Science", educationLevel: "junior_school", gradeLevels: ["Grade 7", "Grade 8", "Grade 9"], createdAt: new Date().toISOString() },
    ];
    for (const s of saSubjects) {
      await setDoc(doc(db, "tenants", "st-austin-academy", "subjects", s.id), s);
    }

    // Seed Sample Initial Students in St. Austin (Playgroup to Grade 9)
    const saStudents: Student[] = [
      {
        id: "stud_101",
        tenantId: "st-austin-academy",
        branchId: "sa_main",
        admissionNo: "SA-2026-0042",
        firstName: "Emmanuel",
        lastName: "Mwangi",
        gender: "male",
        dateOfBirth: "2016-04-12",
        educationLevel: "primary",
        gradeOrClass: "Grade 4",
        stream: "East",
        academicYear: "2026",
        termOrSemester: "Term 1",
        guardianName: "Patrick Mwangi",
        guardianPhone: "+254 720 334 455",
        guardianEmail: "patrick.m@gmail.com",
        guardianRelationship: "Father",
        emergencyContact: "+254 722 889 900",
        medicalInfo: "Asthma - Inhaler kept with school nurse",
        previousSchool: "St. Marys Prep School",
        photoUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150&auto=format&fit=crop&q=80",
        status: "active",
        totalFeeBilled: 38500,
        totalFeePaid: 25000,
        balance: 13500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "stud_102",
        tenantId: "st-austin-academy",
        branchId: "sa_junior",
        admissionNo: "SA-2026-0089",
        firstName: "Amina",
        lastName: "Hassan",
        gender: "female",
        dateOfBirth: "2013-09-25",
        educationLevel: "junior_school",
        gradeOrClass: "Grade 7",
        stream: "Alpha",
        academicYear: "2026",
        termOrSemester: "Term 1",
        guardianName: "Fatuma Hassan",
        guardianPhone: "+254 733 445 566",
        guardianEmail: "fatuma.h@gmail.com",
        guardianRelationship: "Mother",
        emergencyContact: "+254 733 998 877",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        status: "active",
        totalFeeBilled: 45000,
        totalFeePaid: 45000,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "stud_103",
        tenantId: "st-austin-academy",
        branchId: "sa_main",
        admissionNo: "SA-2026-0012",
        firstName: "Liam",
        lastName: "Otieno",
        gender: "male",
        dateOfBirth: "2021-02-18",
        educationLevel: "pre_primary",
        gradeOrClass: "PP2",
        stream: "Butterflies",
        academicYear: "2026",
        termOrSemester: "Term 1",
        guardianName: "Everlyn Otieno",
        guardianPhone: "+254 712 556 677",
        guardianEmail: "everlyn.o@yahoo.com",
        guardianRelationship: "Mother",
        photoUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80",
        status: "active",
        totalFeeBilled: 28000,
        totalFeePaid: 28000,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    for (const s of saStudents) {
      await setDoc(doc(db, "tenants", "st-austin-academy", "students", s.id), s);
    }

    // Seed Sample Initial Students in BITC College
    const bitcStudents: Student[] = [
      {
        id: "bitc_std_01",
        tenantId: "bitc-college",
        branchId: "bitc_main",
        admissionNo: "BITC/DIT/2026/048",
        firstName: "David",
        lastName: "Muchiri",
        gender: "male",
        educationLevel: "college",
        gradeOrClass: "Diploma in ICT - Year 2",
        academicYear: "2026",
        termOrSemester: "Semester 1",
        guardianName: "Joseph Muchiri",
        guardianPhone: "+254 722 001 122",
        guardianEmail: "davmuchiri48@gmail.com",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        status: "active",
        totalFeeBilled: 56000,
        totalFeePaid: 56000,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "bitc_std_02",
        tenantId: "bitc-college",
        branchId: "bitc_main",
        admissionNo: "BITC/DBA/2026/104",
        firstName: "Mercy",
        lastName: "Wanjiru",
        gender: "female",
        educationLevel: "college",
        gradeOrClass: "Diploma in Business Administration - Year 1",
        academicYear: "2026",
        termOrSemester: "Semester 1",
        guardianName: "Hannah Wanjiru",
        guardianPhone: "+254 711 889 900",
        photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
        status: "active",
        totalFeeBilled: 50000,
        totalFeePaid: 35000,
        balance: 15000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    for (const s of bitcStudents) {
      await setDoc(doc(db, "tenants", "bitc-college", "students", s.id), s);
    }

    // Seed Websites for Both Tenants in Firestore!
    const bitcWebsite: TenantWebsiteConfig = {
      tenantId: "bitc-college",
      title: "Breakthrough International Training College",
      tagline: "Centre of Excellence in Professional & Technical Education",
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80",
      primaryColor: "#0284c7",
      phone: "+254 700 123 456 / +254 711 445 566",
      email: "admissions@breakthroughcollege.ac.ke",
      address: "City Centre Plaza, 4th Floor, Moi Avenue, Nairobi, Kenya",
      socialLinks: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        whatsapp: "+254700123456",
      },
      heroSlides: [
        {
          id: "slide_1",
          title: "Build Your Career With TVET Accredited Diplomas",
          subtitle: "Hands-on practical training in Information Technology, Business Administration, Accounting, and Applied Sciences.",
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
          buttonText: "Apply Online Today",
          buttonLink: "#admissions",
        },
        {
          id: "slide_2",
          title: "Modern Computer Labs & Experienced Faculty",
          subtitle: "Equipped with cutting-edge tech equipment, high-speed fiber internet, and industry-certified lecturers.",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
          buttonText: "Explore Courses",
          buttonLink: "#programs",
        },
      ],
      about: {
        heading: "Transforming Potential Into Market-Ready Professionalism",
        content: "Breakthrough International Training College (BITC) is a premier TVET accredited college offering certificate, diploma, and professional examination courses designed in direct alignment with modern industry standards.",
        mission: "To deliver high-impact technical, technological and managerial education through practical innovation.",
        vision: "To become the benchmark TVET institution across East and Central Africa.",
        coreValues: ["Integrity", "Practical Excellence", "Innovation", "Inclusivity", "Professional Ethics"],
        stats: [
          { number: "98%", label: "Graduate Employment Rate" },
          { number: "25+", label: "Accredited Programs" },
          { number: "4,500+", label: "Alumni Worldwide" },
          { number: "100%", label: "Hands-on Practical Labs" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
      },
      programs: [
        {
          id: "prog_dit",
          title: "Diploma in Information Communication Technology (DICT)",
          category: "Computing & IT",
          duration: "2 Years",
          badge: "KNEC Accredited",
          description: "Hands-on software development, database systems, networking, cloud systems, and cybersecurity.",
          imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80",
        },
        {
          id: "prog_dba",
          title: "Diploma in Business Administration & Management",
          category: "Business",
          duration: "2 Years",
          badge: "KNEC / KASNEB",
          description: "Enterprise management, human resources, financial analysis, corporate law, and marketing.",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80",
        },
        {
          id: "prog_cpa",
          title: "Certified Public Accountants (CPA Kenya)",
          category: "Accounting",
          duration: "1.5 Years",
          badge: "KASNEB Professional",
          description: "Comprehensive financial accounting, audit, management accounting, and tax compliance.",
          imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80",
        },
      ],
      gallery: [
        { id: "g1", title: "Modern Computing Lab", category: "Campus", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80" },
        { id: "g2", title: "Graduation Ceremony", category: "Events", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80" },
        { id: "g3", title: "Lecture in Session", category: "Academics", imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80" },
      ],
      newsEvents: [
        {
          id: "ne1",
          title: "September 2026 Intake Now Open",
          type: "announcement",
          date: "2026-08-15",
          summary: "Applications are open for September intake across all diploma and certificate courses.",
          content: "Visit our admissions office or apply directly through our online student portal.",
        },
        {
          id: "ne2",
          title: "Annual Tech Innovation Expo 2026",
          type: "event",
          date: "2026-10-12",
          summary: "Students will showcase AI, IoT, and software applications built during this academic semester.",
          content: "Industry leaders and employers will attend to scout for top talent.",
        },
      ],
      testimonials: [
        {
          id: "t1",
          name: "Faith Njoki",
          role: "Software Developer, Fintech Ltd (Class of 2024)",
          quote: "BITC gave me practical software engineering skills that immediately landed me my first developer role before graduation.",
          rating: 5,
        },
      ],
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "bitc-college", "website_config", "main"), bitcWebsite);

    // St. Austin Primary Website
    const saWebsite: TenantWebsiteConfig = {
      tenantId: "st-austin-academy",
      title: "St. Austin Pre-Primary & Junior Secondary School",
      tagline: "Nurturing Holistic Competence, Creativity and Character",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80",
      primaryColor: "#059669",
      phone: "+254 722 987 654",
      email: "info@staustin.edu",
      address: "Academy Road, Lavington Green, Nairobi, Kenya",
      socialLinks: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        whatsapp: "+254722987654",
      },
      heroSlides: [
        {
          id: "slide_sa_1",
          title: "World-Class Competency Based Curriculum (CBC)",
          subtitle: "From Playgroup, PP1, PP2, Grade 1 to Grade 6, and Junior Secondary (Grade 7 - 9).",
          imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
          buttonText: "Enroll Your Child",
          buttonLink: "#admissions",
        },
      ],
      about: {
        heading: "A Supportive Environment for Academic and Creative Growth",
        content: "At St. Austin, we believe that every child is unique. Our CBC-trained educators inspire critical thinking, digital literacy, artistic creativity, sportsmanship, and strong moral values.",
        mission: "To foster well-rounded young leaders through personalized CBC learning, ethical guidance, and dynamic extracurricular programs.",
        vision: "To be the leading pre-primary, primary and junior secondary institution renowned for excellence.",
        coreValues: ["Character", "Creativity", "Curiosity", "Empathy", "Excellence"],
        stats: [
          { number: "1:15", label: "Teacher to Learner Ratio" },
          { number: "100%", label: "CBC Assessment Pass Rate" },
          { number: "18+", label: "Sports & Club Activities" },
          { number: "Playgroup - Gr 9", label: "Complete School Pathway" },
        ],
        imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
      },
      programs: [
        {
          id: "p_ey",
          title: "Early Years Education (Playgroup, PP1 & PP2)",
          category: "Pre-Primary",
          duration: "Ages 2.5 - 5 Years",
          badge: "Holistic Foundation",
          description: "Play-based discovery, language development, mathematical activities, and psychomotor skills.",
          imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=80",
        },
        {
          id: "p_pri",
          title: "Primary School Education (Grade 1 - Grade 6)",
          category: "Primary CBC",
          duration: "6 Years",
          badge: "KNEC / CBC Compliant",
          description: "Rigorous literacy, science & technology, environmental activities, agriculture, and creative arts.",
          imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80",
        },
        {
          id: "p_jss",
          title: "Junior Secondary School (Grade 7 - Grade 9)",
          category: "Junior Secondary",
          duration: "3 Years",
          badge: "Pre-Technical & Science Wing",
          description: "Integrated science, pre-technical studies, computer science, foreign languages, and sports science.",
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80",
        },
      ],
      gallery: [
        { id: "sg1", title: "Science Discovery Fair", category: "Academics", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80" },
        { id: "sg2", title: "Sports & Swimming Day", category: "Co-Curricular", imageUrl: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=600&auto=format&fit=crop&q=80" },
      ],
      newsEvents: [
        {
          id: "sne1",
          title: "Term 1 CBC Open Day & Learner Exhibitions",
          type: "event",
          date: "2026-03-27",
          summary: "Parents and guardians are invited to review learner portfolios, projects, and assessment reports.",
          content: "Meet with class teachers and review your child's competency achievements.",
        },
      ],
      testimonials: [
        {
          id: "st1",
          name: "Dr. Catherine Muthoni",
          role: "Parent of Grade 4 & Grade 7 Learners",
          quote: "The personalized attention and CBC project-based approach at St. Austin has brought out remarkable confidence and critical thinking in my children.",
          rating: 5,
        },
      ],
      isPublished: true,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "tenants", "st-austin-academy", "website_config", "main"), saWebsite);

    // Also ensure Platform Config document exists for Davetech
    const platformDocRef = doc(db, "platform_settings", "davetech_main");
    const platformSnap = await getDoc(platformDocRef);
    if (!platformSnap.exists()) {
      const defaultPlatform = getDefaultPlatformConfig();
      await setDoc(platformDocRef, defaultPlatform);
    }

    console.log("Flagship tenants, websites, and Davetech platform config initialized into Firestore!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

// ==========================================
// 14. DAVETECH PLATFORM CONFIG & SETTINGS
// ==========================================

export function getDefaultPlatformConfig(): PlatformConfig {
  return {
    id: "davetech_main",
    name: "DAVETECH Software & Cloud Solutions",
    brandName: "DAVETECH",
    tagline: "Enterprise Multi-Tenant Educational Operating System & Institutional Cloud",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
    heroTitle: "Enterprise Technology Built for Scale.",
    heroHighlight: "School ERP, POS, Web & Custom Cloud.",
    heroSubtitle: "DAVETECH delivers battle-tested software systems across Kenya and East Africa. Choose from our complete educational ERP platform, fast retail POS system, high-converting corporate websites, or bespoke custom software engineering.",
    heroBadgeText: "4 Flagship Cloud Packages",
    heroSlides: [
      {
        id: "slide_1",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
        title: "Enterprise Software & Cloud Platforms",
        subtitle: "Multi-tenant scalability for universities, schools, and modern businesses",
        caption: "Nairobi Engineering & Cloud Center",
      },
      {
        id: "slide_2",
        imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
        title: "Autonomous School ERP & CBC Systems",
        subtitle: "Automated report cards, student profiles, and multi-campus synchronization",
        caption: "Smart Educational Cloud",
      },
      {
        id: "slide_3",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=1600&auto=format&fit=crop&q=80",
        title: "Retail POS & Barcode Inventory",
        subtitle: "Instant M-Pesa receipting, stock tracking, and multi-branch registers",
        caption: "Retail POS Terminal",
      },
      {
        id: "slide_4",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80",
        title: "High-Converting Business Portals",
        subtitle: "Lead generation, SEO optimization, and corporate digital presence",
        caption: "Custom Web Solutions",
      },
    ],
    heroVisualSettings: {
      fontAlignment: "center",
      fontFamily: "sans",
      fontSize: "large",
      fontStyle: "bold",
      photoTransparency: 85, // 85% opacity of image
      overlayOpacity: 75, // 75% dark tint overlay
      overlayColor: "#020617",
      imageBlur: 0,
      imageBrightness: 100,
      imageFit: "cover",
      autoSlide: true,
      slideInterval: 6,
      activeSlideIndex: 0,
    },
    announcementBanner: "🚀 Davetech Cloud v4.2 Release: Live Automated CBC Assessments, Real-Time Fee Gateways & Multi-Campus Syncing Now Live!",
    supportEmail: "contact@davetech.co.ke",
    supportPhone: "+254 700 000 123",
    whatsappPhone: "+254 700 000 123",
    address: "Davetech Innovation Tower, Upper Hill, Nairobi, Kenya",
    websiteUrl: "https://davetecherp.com",
    primaryColor: "#4f46e5", // Indigo
    accentColor: "#06b6d4", // Cyan
    enablePublicRegistrations: true,
    enableMultiCampus: true,
    stats: {
      institutionsCount: 45,
      studentsCount: 128500,
      uptime: "99.98%",
      countries: 6,
    },
    features: [
      {
        id: "feat_multitenant",
        title: "Multi-Tenant Architecture & Subdomains",
        description: "Zero data crossover with isolated Firestore documents, custom domains, and dedicated subdomains per school.",
        iconName: "Layers",
        category: "Cloud Infrastructure",
      },
      {
        id: "feat_cbc_academic",
        title: "CBC, 8-4-4 & TVET Grading Engines",
        description: "Built-in assessment rubrics (Exceeding, Meeting, Approaching, Below Expectation), modular transcripts, and automated student report cards.",
        iconName: "GraduationCap",
        category: "Academic Engine",
      },
      {
        id: "feat_finance",
        title: "Fee Accounting & Automatic Receipts",
        description: "Itemized vote-heads, automated invoicing, real-time payment reconciliation, PDF fee receipts, and parent statement portals.",
        iconName: "CreditCard",
        category: "Financial Management",
      },
      {
        id: "feat_website_cms",
        title: "Instant Branded Public Website & CMS",
        description: "Every institution receives a high-speed, mobile-responsive public website, carousel builder, and admissions inquiry portal.",
        iconName: "Globe",
        category: "Digital Presence",
      },
      {
        id: "feat_attendance_qr",
        title: "Smart Attendance & QR Verification",
        description: "Daily roll-call with period logs, parent SMS notification triggers, and printable QR-code student ID card verification.",
        iconName: "QrCode",
        category: "Security & Ops",
      },
      {
        id: "feat_multicampus",
        title: "Multi-Campus & Branch Synchronization",
        description: "Manage multiple constituent campuses, satellites, and annexes from one centralized executive dashboard.",
        iconName: "Network",
        category: "Enterprise Scale",
      },
    ],
    plans: [
      {
        id: "plan_starter",
        name: "Standard School Edition",
        price: 15000,
        currency: "KES",
        billingCycle: "termly",
        tagline: "Ideal for pre-primary & single-stream primary academies.",
        maxStudents: 300,
        maxBranches: 1,
        features: [
          "CBC Assessment & Report Cards",
          "Student & Parent Directory",
          "Fee Invoicing & Receipts",
          "Basic Public School Website",
          "Single Campus Branch",
          "Standard Email Support",
        ],
      },
      {
        id: "plan_professional",
        name: "Professional Institution",
        price: 35000,
        currency: "KES",
        billingCycle: "termly",
        tagline: "For comprehensive primary, junior & senior secondary institutions.",
        badge: "Most Popular",
        isPopular: true,
        maxStudents: 1200,
        maxBranches: 2,
        features: [
          "All Standard School Features",
          "Junior School Pre-Technical Tracking",
          "Multi-Stream CBC Gradebooks",
          "Custom Subdomain & DNS",
          "Timetable & Exam Scheduling",
          "QR Code Student ID Badges",
          "Role-Based Access (Teachers & Parents)",
          "Priority 24/7 Phone Support",
        ],
      },
      {
        id: "plan_enterprise",
        name: "Enterprise Multi-Campus Cloud",
        price: 75000,
        currency: "KES",
        billingCycle: "termly",
        tagline: "For TVET colleges, universities, and multi-campus school groups.",
        badge: "Full Power",
        maxStudents: 10000,
        maxBranches: 10,
        features: [
          "Unlimited Multi-Campus & Branches",
          "TVET Modular & Semester Grading",
          "Custom Domain (e.g. portal.school.edu)",
          "Interactive Website CMS & Admissions",
          "Audit Trail Logs & Role Simulator",
          "Dedicated Cloud Infrastructure",
          "Custom Branding & White-Labeling",
          "Dedicated Account Engineer",
        ],
      },
    ],
    testimonials: [
      {
        id: "pt1",
        name: "Eng. Geoffrey Mwangi",
        institution: "Breakthrough International Training College",
        role: "Director of Academic Affairs",
        quote: "Davetech transformed our TVET administration. Course registration, semester transcripts, and multi-campus billing are now unified in one lightning-fast cloud.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      },
      {
        id: "pt2",
        name: "Sister Margaret Wambui",
        institution: "St. Austin Pre-Primary & Junior Secondary",
        role: "Head of School",
        quote: "The CBC assessment rubrics and instant parent report cards have saved our teachers hundreds of hours each term. Davetech is indispensable.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
  try {
    const docRef = doc(db, "platform_settings", "davetech_main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PlatformConfig;
    }
    const def = getDefaultPlatformConfig();
    await setDoc(docRef, def);
    return def;
  } catch (error) {
    console.error("getPlatformConfig error:", error);
    return getDefaultPlatformConfig();
  }
}

export async function savePlatformConfig(
  config: Partial<PlatformConfig>,
  author?: { name: string; email?: string }
): Promise<void> {
  const docRef = doc(db, "platform_settings", "davetech_main");
  const snap = await getDoc(docRef);
  const current = snap.exists() ? snap.data() : getDefaultPlatformConfig();
  const updated = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, updated, { merge: true });

  await logAuditEvent({
    action: "UPDATE",
    module: "PLATFORM_SETTINGS",
    recordId: "davetech_main",
    userName: author?.name || "Platform Super Admin",
    userEmail: author?.email || "davmuchiri48@gmail.com",
    details: "Updated Davetech platform configuration and branding settings.",
  });
}

export function subscribeToPlatformConfig(
  callback: (config: PlatformConfig) => void
): Unsubscribe {
  const docRef = doc(db, "platform_settings", "davetech_main");
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as PlatformConfig);
    } else {
      callback(getDefaultPlatformConfig());
    }
  });
}

export async function savePublicInquiry(inquiry: PublicInquiry): Promise<void> {
  const colRef = collection(db, "public_inquiries");
  await setDoc(doc(colRef, inquiry.id), inquiry);
}
