import { fetchStudentDiscountsList } from "@/lib/api/student-finance-lists";
import { queryKeys } from "@/lib/query-keys";
import type { StudentFinanceListFilters } from "@/modules/admin/students/shared/student-finance-list-types";
import { useQuery } from "@tanstack/react-query";

export function useStudentDiscountsList(filters: StudentFinanceListFilters) {
  return useQuery({
    queryKey: queryKeys.studentFinance.discounts(filters),
    queryFn: () => fetchStudentDiscountsList(filters),
    staleTime: 30000,
  });
}
