import { setDefaultBankAccount } from "@/lib/api/bank_accounts";
import { queryKeys } from "@/lib/query-keys";
import {
  APIError,
  BankAccountsData,
  SetDefaultBankResponse,
} from "@repo/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ToggleBankAccountContext = {
  previousBankAccounts: [QueryKey, BankAccountsData | undefined][];
};
export const useSetDefaultBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SetDefaultBankResponse,
    AxiosError<APIError>,
    { accountID: string },
    ToggleBankAccountContext
  >({
    mutationFn: ({ accountID }) => setDefaultBankAccount({ accountID }),
    onMutate: async ({ accountID }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bankAccounts.all });
      const previousBankAccounts = queryClient.getQueriesData<BankAccountsData>(
        {
          queryKey: queryKeys.bankAccounts.all,
        },
      );

      queryClient.setQueriesData<BankAccountsData>(
        { queryKey: queryKeys.bankAccounts.all },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            bankAccounts: old.bankAccounts.map((b) => ({
              ...b,
              isDefault: b.id === accountID,
            })),
          };
        },
      );
      return { previousBankAccounts };
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts.all });
    },
    onError: (error, _, context) => {
      if (context?.previousBankAccounts) {
        queryClient.setQueryData(
          queryKeys.bankAccounts.all,
          context.previousBankAccounts,
        );
      }
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
