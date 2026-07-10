import { updateBankAccount } from "@/lib/api/bank_accounts";
import { queryKeys } from "@/lib/query-keys";
import {
  APIError,
  UpdateBankAccountInput,
  UpdateBankAccountResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBankAccountResponse,
    AxiosError<APIError>,
    UpdateBankAccountInput & { accountID: string }
  >({
    mutationFn: ({ accountID, ...data }) =>
      updateBankAccount({ accountID, data }),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: queryKeys.bankAccounts.all,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
