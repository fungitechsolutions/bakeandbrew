import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiError } from "@/lib/axios";
import { createBank } from "@/lib/api/banks";
import {
  CreateBankInput,
  CreateBankResponse,
} from "@repo/types/admin/accounting/bank";

export const useCreateBank = (page: number) => {
  const queryClient = useQueryClient();

  return useMutation<CreateBankResponse, AxiosError<ApiError>, CreateBankInput>(
    {
      mutationFn: (data) => createBank(data),
      onSuccess: (result) => {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["admin-banks", page] });
      },
      onError: (error) => {
        toast.error(error.message ?? "Something went wrong");
      },
    },
  );
};
