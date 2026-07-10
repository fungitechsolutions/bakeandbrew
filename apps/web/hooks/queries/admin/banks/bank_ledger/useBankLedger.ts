import { getBankLedger } from "@/lib/api/bank_ledger";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useBankLedger = (page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.bankLedger.all,
    queryFn: () => getBankLedger({ page }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
