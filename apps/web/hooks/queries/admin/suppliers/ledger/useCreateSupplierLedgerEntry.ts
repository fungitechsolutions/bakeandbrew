import {
  CreateSupplierLedgerEntryInput,
  CreateSupplierLedgerEntryResponse,
} from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { createSupplierLedger } from "@/lib/api/supplier_ledger";

export const useCreateSupplierLedgerEntry = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateSupplierLedgerEntryResponse,
    AxiosError<ApiError>,
    CreateSupplierLedgerEntryInput & { supplierID: string }
  >({
    mutationFn: ({ supplierID, ...data }) =>
      createSupplierLedger(supplierID, data),

    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: queryKeys.suppliers.ledger.all,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Something went wrong");
    },
  });
};
