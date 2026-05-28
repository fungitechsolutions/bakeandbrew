import { deleteBankAccount } from "@/lib/api/bank_accounts";
import { ApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { DeleteBankAccountResponse } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteBankAccountResponse,
    AxiosError<ApiError>,
    { accountID: string }
  >({
    mutationFn: ({ accountID }) => deleteBankAccount({ accountID }),
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
