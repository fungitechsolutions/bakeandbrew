import { deleteSupplier } from "@/lib/api/supplier";
import { ApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { DeleteSupplierResponse } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteSupplierResponse,
    AxiosError<ApiError>,
    { supplierID: string }
  >({
    mutationFn: ({ supplierID }) => deleteSupplier(supplierID),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
