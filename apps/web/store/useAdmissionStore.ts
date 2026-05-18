import { create } from "zustand";

export interface SubmittedAdmission {
  referenceNo: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  source: string;
  shift: "morning" | "day" | "evening";
  shiftTime: string;
  courses: string[];
  photoURL: string | null;
  status: "pending" | "active" | "rejected" | "completed";
  createdAt: string;
  fiscalYear: string;
  email: string;
}

interface AdmissionState {
  submittedStudent: SubmittedAdmission | null;

  setSubmittedStudent: (student: SubmittedAdmission) => void;

  clearSubmittedStudent: () => void;
}

export const useAdmissionStore = create<AdmissionState>((set) => ({
  submittedStudent: null,

  setSubmittedStudent: (student) => set({ submittedStudent: student }),

  clearSubmittedStudent: () => set({ submittedStudent: null }),
}));
