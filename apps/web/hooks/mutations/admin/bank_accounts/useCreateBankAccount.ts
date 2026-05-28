import { createBankAccount } from "@/lib/api/bank_accounts";
import { ApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { CreateBankAccountInput, CreateBankAccountResponse } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBankAccountResponse,
    AxiosError<ApiError>,
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
