import { createSupplier } from "@/lib/api/supplier";
import { ApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { CreateSupplierInput, CreateSupplierResponse } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateSupplierResponse,
    AxiosError<ApiError>,
    CreateSupplierInput
  >({
    mutationFn: createSupplier,
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
