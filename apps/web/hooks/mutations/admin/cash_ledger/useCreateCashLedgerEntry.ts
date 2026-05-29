import { createCashLedgerEntry } from "@/lib/api/cash_ledger";
import {
  CreateCashLedgerEntryInput,
  CreateCashLedgerEntryResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";

export const useCreateCashLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateCashLedgerEntryResponse,
    AxiosError<ApiError>,
    CreateCashLedgerEntryInput
  >({
    mutationFn: ({ ...data }) => createCashLedgerEntry({ data }),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.cashLedger.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
