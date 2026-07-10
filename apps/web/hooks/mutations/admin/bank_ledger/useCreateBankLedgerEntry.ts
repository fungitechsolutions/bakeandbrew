import { createBankLedger } from "@/lib/api/bank_ledger";
import { queryKeys } from "@/lib/query-keys";
import {
  CreateBankLedgerEntryInput,
  CreateBankLedgerEntryResponse,
  APIError,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateBankLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateBankLedgerEntryResponse,
    AxiosError<APIError>,
    CreateBankLedgerEntryInput & { accountID: string }
  >({
    mutationFn: ({ accountID, ...data }) =>
      createBankLedger({ data, accountID }),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.bankLedger.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
