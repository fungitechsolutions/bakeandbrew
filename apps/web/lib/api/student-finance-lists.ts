import api from "@/lib/axios";
import type {
  DiscountsListData,
  PaymentsListData,
  ScholarshipsListData,
  StudentFinanceListApiResponse,
  StudentFinanceListFilters,
} from "@/modules/admin/students/shared/student-finance-list-types";

function buildListParams(filters: StudentFinanceListFilters): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.search) params.set("search", filters.search);
  return params;
}

export async function fetchStudentPaymentsList(
  filters: StudentFinanceListFilters,
): Promise<StudentFinanceListApiResponse<PaymentsListData>> {
  const res = await api.get(
    `/admin/students/payments?${buildListParams(filters).toString()}`,
  );
  return res.data;
}

export async function fetchStudentDiscountsList(
  filters: StudentFinanceListFilters,
): Promise<StudentFinanceListApiResponse<DiscountsListData>> {
  const res = await api.get(
    `/admin/students/discounts?${buildListParams(filters).toString()}`,
  );
  return res.data;
}

export async function fetchStudentScholarshipsList(
  filters: StudentFinanceListFilters,
): Promise<StudentFinanceListApiResponse<ScholarshipsListData>> {
  const res = await api.get(
    `/admin/students/scholarships?${buildListParams(filters).toString()}`,
  );
  return res.data;
}
