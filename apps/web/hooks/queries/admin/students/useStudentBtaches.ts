import { getDistinctBatches } from "@/lib/api/batch";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useStudentBatches = () => {
  return useQuery({
    queryKey: queryKeys.batches.list(),
    queryFn: getDistinctBatches,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 20,
  });
};
