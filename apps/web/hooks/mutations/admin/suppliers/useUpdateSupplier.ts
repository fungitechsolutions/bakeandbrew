import { queryKeys } from "@/lib/query-keys";
import {
  APIError,
  UpdateSupplierInput,
  UpdateSupplierResponse,
} from "@repo/types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateSupplier } from "@/lib/api/supplier";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateSupplierResponse,
    AxiosError<APIError>,
    UpdateSupplierInput & { supplierID: string }
  >({
    mutationFn: ({ supplierID, ...data }) =>
      updateSupplier({ supplierID, data }),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
