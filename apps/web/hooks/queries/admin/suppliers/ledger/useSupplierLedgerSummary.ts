import { getSupplierLedgerSummary } from "@/lib/api/supplier_ledger";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useSupplierLedgerSummary = ({
  supplierID,
  fromDate,
  toDate,
}: {
  supplierID: string | null;
  fromDate: string | null;
  toDate: string | null;
}) => {
  return useQuery({
    queryKey: queryKeys.suppliers.ledger.summary({
      supplierID,
      fromDate,
      toDate,
    }),
    queryFn: () => getSupplierLedgerSummary({ supplierID, fromDate, toDate }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 20,
  });
};
