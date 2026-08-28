import QRCode from "qrcode";
import type { Student, Tenant } from "../types";

export interface StudentQRPayload {
  type: "DAVETECH_STUDENT_ID";
  version: "1.0";
  studentId: string;
  admissionNo: string;
  fullName: string;
  tenantId: string;
  tenantName: string;
  gradeOrClass: string;
  nemisNumber?: string;
  assessmentNumber?: string;
  emergencyPhone: string;
  verificationUrl: string;
  issuedAt: string;
}

/**
 * Generates the standardized QR payload string for a student ID card
 */
export function generateStudentQRPayload(student: Student, tenant?: Tenant | null): string {
  const sub = (tenant?.subdomain || tenant?.code || "app").toLowerCase();
  const verificationUrl = `https://${sub}.davetecherp.com/verify/student/${student.admissionNo}`;
  
  const payload: StudentQRPayload = {
    type: "DAVETECH_STUDENT_ID",
    version: "1.0",
    studentId: student.id,
    admissionNo: student.admissionNo,
    fullName: `${student.firstName} ${student.middleName ? student.middleName + " " : ""}${student.lastName}`,
    tenantId: student.tenantId,
    tenantName: tenant?.name || "DAVETECH Educational Institution",
    gradeOrClass: student.gradeOrClass,
    nemisNumber: student.nemisNumber,
    assessmentNumber: student.assessmentNumber,
    emergencyPhone: student.guardianPhone,
    verificationUrl,
    issuedAt: new Date().toISOString(),
  };

  // We serialize as compact JSON, with fallback admissionNo prefix for simple scanner parsing
  return JSON.stringify(payload);
}

/**
 * Generates a QR Code as a high-quality Data URL (base64 PNG)
 */
export async function generateQRCodeDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: options?.width || 256,
      color: {
        dark: options?.color?.dark || "#1e1b4b", // Deep indigo-950
        light: options?.color?.light || "#ffffff",
      },
      ...options,
    });
  } catch (err) {
    console.error("Failed to generate QR Code Data URL:", err);
    // Fallback simple SVG QR placeholder or empty
    return "";
  }
}
