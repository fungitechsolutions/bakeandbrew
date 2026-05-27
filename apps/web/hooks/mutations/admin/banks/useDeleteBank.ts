import { deleteBank } from "@/lib/api/banks";
import { ApiError } from "@/lib/axios";
import { DeleteBankResponse } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteBankResponse,
    AxiosError<ApiError>,
    { bankID: string }
  >({
    mutationFn: ({ bankID }) => deleteBank(bankID),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-banks"] });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
