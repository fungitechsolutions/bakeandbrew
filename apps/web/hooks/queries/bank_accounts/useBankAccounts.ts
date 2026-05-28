import { getBankAccounts } from "@/lib/api/bank_accounts";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useBankAccounts = (page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.bankAccounts.list(page),
    queryFn: () => getBankAccounts(page),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
