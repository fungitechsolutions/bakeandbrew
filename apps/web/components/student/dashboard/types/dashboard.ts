export type StudentStatus = "active" | "completed";
export type Shift = "morning" | "day" | "evening";
export type PaymentMode =
  | "cash"
  | "bank_transfer"
  | "esewa"
  | "khalti"
  | "cheque";

export interface Course {
  id: string;
  name: string;
  slug: string;
  feeAtEnrollment: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  addedAt: string; // ISO date string
  remarks: string | null;
  paymentMode: PaymentMode;
}

export interface StudentDashboardData {
  id: string;
  studentId: string;
  referenceNo: string;
  fiscalYear: string;
  serialNo: number;
  fullName: string;
  dob: string; // ISO date string
  gender: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  photoUrl: string | null;
  status: StudentStatus;
  shift: Shift;
  shiftTime: string;
  batch: string | null;
  notes: string | null;
  createdAt: string;
  enrolledCourses: Course[];
  payments: Payment[];
}
