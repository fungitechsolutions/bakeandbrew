export interface SalesStudent {
  userId: string;
  name: string;
  email: string;
  totalCourseFee: number;
  totalPaid: number;
  outstanding: number;
  totalDiscount: number;
  totalScholarship: number;
  studentId: string;
}

export interface SalesResponse {
  students: SalesStudent[];
  totalSalesFees: number;
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

export interface SalesFilters {
  page: number;
  from: string;
  to: string;
  // search: string; // reserved for future use
}
