export type TenantType = 
  | 'school_primary' 
  | 'school_junior' 
  | 'college_tvet' 
  | 'university' 
  | 'church_ministry' 
  | 'hospital' 
  | 'retail_pos' 
  | 'general_business';

export type EducationLevel = 
  | 'pre_primary' 
  | 'primary' 
  | 'junior_school' 
  | 'secondary' 
  | 'tvet' 
  | 'college' 
  | 'university';

export type UserRole = 
  | 'platform_super_admin'
  | 'platform_admin'
  | 'tenant_owner'
  | 'tenant_admin'
  | 'manager'
  | 'accountant'
  | 'teacher'
  | 'lecturer'
  | 'admissions_officer'
  | 'hr_officer'
  | 'student'
  | 'parent'
  | 'staff';

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  code: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  country: string;
  status: 'active' | 'suspended' | 'pending';
  subscriptionPlan: 'starter' | 'growth' | 'enterprise';
  enabledModules: string[];
  currency: string;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  subdomain?: string;
  customDomain?: string;
  motto?: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  isMain: boolean;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  branchId?: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions?: Record<string, boolean>;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Student {
  id: string;
  tenantId: string;
  branchId?: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'other';
  educationLevel: EducationLevel;
  gradeOrClass: string; // e.g. "Playgroup", "PP1", "PP2", "Grade 1", ..., "Grade 9", "Diploma IT"
  stream?: string; // e.g. "East", "West", "Alpha", "Blue"
  academicYear: string;
  termOrSemester: string;
  
  // National & Examination Identifiers
  assessmentNumber?: string; // KNEC Assessment / CBA / Index Number
  nemisNumber?: string; // NEMIS / National Education Management Information System Number
  upi?: string; // Unique Personal Identifier (Ministry of Education)
  birthCertificateNo?: string;

  // Complete Student Biography & Demographics
  bio?: string; // Detailed bio, personal aspirations, strengths, character notes
  nationality?: string;
  religion?: string;
  county?: string;
  subCounty?: string;
  residenceAddress?: string;

  // Guardian & Family Contact Details
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelationship?: string;
  guardianOccupation?: string;
  guardianIdNumber?: string;
  guardianAltPhone?: string;
  emergencyContact?: string;

  // Medical & Special Educational Needs
  bloodGroup?: string;
  medicalInfo?: string;
  allergies?: string;
  dietaryRequirements?: string;
  specialNeeds?: string;

  // Extracurricular & Interests
  talentsAndHobbies?: string;
  clubMemberships?: string[];
  previousSchool?: string;
  enrollmentDate?: string;
  photoUrl?: string;

  // Financial & Enrollment Status
  status: 'active' | 'graduated' | 'transferred' | 'suspended' | 'alumni';
  totalFeeBilled: number;
  totalFeePaid: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  tenantId: string;
  branchId?: string;
  staffNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string; // e.g. "Head Teacher", "Class Teacher - Grade 4", "Senior Lecturer", "Bursar"
  role?: string;
  department?: string;
  educationLevelAssigned?: EducationLevel;
  photoUrl?: string;
  employmentType: 'full_time' | 'part_time' | 'contract';
  salary?: number;
  joinDate?: string;
  status: 'active' | 'on_leave' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export interface AcademicClass {
  id: string;
  tenantId: string;
  branchId?: string;
  name: string; // e.g. "Grade 4 East", "PP1 Red", "Diploma in Accounting - Year 1"
  educationLevel: EducationLevel;
  grade: string;
  stream: string;
  classTeacherId?: string;
  classTeacherName?: string;
  room?: string;
  capacity?: number;
  academicYear: string;
  term: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  tenantId: string;
  code: string;
  name: string; // e.g. "Mathematics", "English Language Activities", "Integrated Science"
  educationLevel: EducationLevel;
  gradeLevels: string[];
  department?: string;
  isElective?: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  department: string;
  level: string; // e.g. "Certificate", "Diploma", "Higher Diploma", "Degree"
  duration: string; // e.g. "2 Years (6 Semesters)"
  feePerTerm: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  headOfDept?: string;
  description?: string;
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  tenantId: string;
  year: string; // e.g. "2026", "2026/2027"
  terms: {
    term: string;
    startDate: string;
    endDate: string;
  }[];
  isCurrent: boolean;
  createdAt: string;
}

export interface FeeStructure {
  id: string;
  tenantId: string;
  branchId?: string;
  title?: string;
  educationLevel: EducationLevel;
  gradeOrCourse?: string;
  gradeOrClass?: string;
  academicYear: string;
  term?: string;
  termOrSemester?: string;
  items: {
    title?: string;
    name?: string;
    amount: number;
  }[];
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  branchId?: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  gradeOrClass: string;
  academicYear: string;
  term: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  items: {
    title: string;
    amount: number;
  }[];
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  branchId?: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  invoiceId?: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Bank Transfer' | 'Cash' | 'Cheque' | 'Credit Card';
  transactionRef: string;
  paymentDate: string;
  recordedBy: string;
  notes?: string;
  createdAt: string;
}

export interface AssessmentRecord {
  studentId: string;
  studentName: string;
  admissionNo: string;
  marks: number;
  maxMarks: number;
  grade: string; // e.g. "A", "B", "C" or CBC: "EE", "ME", "AE", "BE"
  competencyLevel?: 'Exceeding Expectations' | 'Meeting Expectations' | 'Approaching Expectations' | 'Below Expectations';
  remarks?: string;
}

export interface Assessment {
  id: string;
  tenantId: string;
  branchId?: string;
  title: string; // e.g. "Term 1 Mid-Term 2026", "CBC Continuous Assessment"
  educationLevel: EducationLevel;
  grade: string;
  stream?: string;
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  term: string;
  academicYear: string;
  date: string;
  records: AssessmentRecord[];
  createdAt: string;
}

export interface AttendanceRecord {
  id?: string;
  tenantId?: string;
  branchId?: string;
  date?: string;
  gradeOrClass?: string;
  remarks?: string;
  recordedBy?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  createdAt?: string;
}

export interface DailyAttendance {
  id: string;
  tenantId: string;
  branchId?: string;
  date: string;
  classId: string;
  className: string;
  educationLevel: EducationLevel;
  markedBy: string;
  records: AttendanceRecord[];
  createdAt: string;
}

export interface TimetablePeriod {
  time: string;
  subjectName: string;
  teacherName: string;
  room?: string;
}

export interface TimetableDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface Timetable {
  id: string;
  tenantId: string;
  branchId?: string;
  classId: string;
  className: string;
  academicYear: string;
  term: string;
  days: TimetableDay[];
  createdAt: string;
}

export interface Certificate {
  id: string;
  tenantId: string;
  branchId?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  title: string; // e.g. "Certificate of Primary Education Completion", "Diploma in Information Technology"
  type?: string;
  programOrClass?: string;
  gradeOrAward?: string; // e.g. "Distinction", "Honours"
  gradeOrHonors?: string;
  issueDate: string;
  certNumber?: string;
  certificateNumber?: string;
  qrCodeValue?: string;
  qrCodeUrl?: string;
  verified?: boolean;
  issuedBy?: string;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface ProgramShowcase {
  id: string;
  title: string;
  category: string;
  description: string;
  duration?: string;
  badge?: string;
  imageUrl?: string;
  link?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  type: 'news' | 'event' | 'announcement';
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g. "Parent of Grade 5 Student", "Alumnus - Class of 2025"
  quote: string;
  avatarUrl?: string;
  rating?: number;
}

export interface TenantWebsiteConfig {
  id?: string;
  tenantId: string;
  title: string;
  tagline: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutUs?: string;
  features?: { title: string; description: string; icon: string }[];
  programsOffered?: { name: string; description: string; level: string }[];
  admissionsOpen?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone?: string;
  email?: string;
  address?: string;
  googleMapsEmbed?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };
  heroSlides?: HeroSlide[];
  about?: {
    heading: string;
    content: string;
    mission: string;
    vision: string;
    coreValues: string[];
    stats: { number: string; label: string }[];
    imageUrl?: string;
  };
  programs?: ProgramShowcase[];
  gallery?: string[] | GalleryItem[];
  newsEvents?: NewsEvent[];
  testimonials?: Testimonial[];
  isPublished?: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  tenantId?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  action: string;
  module: string;
  recordId?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface PublicInquiry {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  phone: string;
  programInterestedIn?: string;
  message: string;
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: string;
}
