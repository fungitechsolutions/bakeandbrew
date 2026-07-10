import { createBankAccount } from "@/lib/api/bank_accounts";
import { queryKeys } from "@/lib/query-keys";
import {
  APIError,
  CreateBankAccountInput,
  CreateBankAccountResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBankAccountResponse,
    AxiosError<APIError>,
    CreateBankAccountInput & { bankID: string }
  >({
    mutationFn: ({ bankID, ...data }) => createBankAccount({ bankID, data }),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong.");
    },
  });
};
