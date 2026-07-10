import { CashLedgerSummary } from "@repo/types";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getCashLedgerSummary } from "@/lib/api/cash_ledger";

export const useCashLedgerSummary = ({
  fromDate,
  toDate,
}: {
  fromDate: string | null;
  toDate: string | null;
}) => {
  return useQuery<CashLedgerSummary>({
    queryKey: queryKeys.cashLedger.summary(
      fromDate ?? undefined,
      toDate ?? undefined,
    ),
    queryFn: () =>
      getCashLedgerSummary({
        fromAD: fromDate ?? undefined,
        toAD: toDate ?? undefined,
      }),
  });
};
