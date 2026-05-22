export interface OutstandingStudent {
  userId: string;
  name: string;
  email: string;
  totalCourseFee: number;
  totalPaid: number;
  outstanding: number;
  studentId: string;
  totalDiscount: number;
  totalScholarship: number;
}

export interface OutstandingResponse {
  students: OutstandingStudent[];
  totalOutstandingFees: number;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  limit: number;
  page: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  code?: string;
  meta?: PaginationMeta;
  data?: T;
}

export interface OutstandingFilters {
  page: number;
  from: string;
  to: string;
  search: string;
}
