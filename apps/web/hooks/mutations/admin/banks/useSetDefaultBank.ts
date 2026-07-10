import { BanksData, setDefaultBank } from "@/lib/api/banks";
import { APIError } from "@repo/types";
import { SetDefaultBankResponse } from "@repo/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ToggleBankContext = {
  previousBanks: [QueryKey, BanksData | undefined][];
};

export const useSetDefaultBank = (page: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    SetDefaultBankResponse,
    AxiosError<APIError>,
    { bankID: string },
    ToggleBankContext
  >({
    mutationFn: ({ bankID }) => setDefaultBank(bankID),

    onMutate: async ({ bankID }) => {
      await queryClient.cancelQueries({
        queryKey: ["admin-banks", page],
      });

      const previousBanks = queryClient.getQueriesData<BanksData>({
        queryKey: ["admin-banks", page],
      });

      queryClient.setQueriesData<BanksData>(
        { queryKey: ["admin-banks", page] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            banks: oldData.banks.map((bank) => ({
              ...bank,
              isDefault: bank.id === bankID,
            })),
          };
        },
      );

      return { previousBanks };
    },

    onSuccess: (result) => {
      toast.success(result.message);
    },

    onError: (error, _, context) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
      if (context?.previousBanks) {
        queryClient.setQueryData(["admin-banks", page], context.previousBanks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-banks", page],
      });
    },
  });
};
