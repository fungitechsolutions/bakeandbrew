import { updateBank } from "@/lib/api/banks";
import { ApiError } from "@/lib/axios";
import { UpdateBankResponse } from "@repo/types";
import { UpdateBankInput } from "@repo/types/admin/accounting/bank";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateBankResponse,
    AxiosError<ApiError>,
    UpdateBankInput & { bankID: string }
  >({
    mutationFn: ({ bankID, ...data }) => updateBank(data, bankID),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-banks"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
