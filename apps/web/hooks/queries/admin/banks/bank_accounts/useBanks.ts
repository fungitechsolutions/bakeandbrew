import { getBanks } from "@/lib/api/bank_accounts";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useBanks = () => {
  return useQuery({
    queryKey: queryKeys.banks.all,
    queryFn: getBanks,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
