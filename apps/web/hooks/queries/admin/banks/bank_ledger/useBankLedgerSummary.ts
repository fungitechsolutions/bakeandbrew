import {
  getBankLedgerSummary,
  GetBankLedgerSummaryParams,
} from "@/lib/api/bank_ledger";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useBankLedgerSummary = ({
  accountID,
  bankID,
  fromDate,
  toDate,
}: GetBankLedgerSummaryParams) => {
  return useQuery({
    queryKey: queryKeys.bankLedger.summary({
      accountID,
      bankID,
      fromDate,
      toDate,
    }),
    queryFn: () =>
      getBankLedgerSummary({ accountID, bankID, fromDate, toDate }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 20,
  });
};
