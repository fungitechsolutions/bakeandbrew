import { GetBankLedgerSummaryParams } from "./api/bank_ledger";

export const queryKeys = {
  bankAccounts: {
    all: ["admin-bank-accounts"] as const,
    list: (page: number) => ["admin-bank-accounts", "list", page] as const,
    details: (id: string) => ["admin-bank-accounts", "detail", id] as const,
    dropdown: ["admin-bank-accounts", "dropdown"] as const,
  },
  banks: {
    all: ["admin-banks"] as const,
    detail: (id: string) => ["admin-banks", id] as const,
  },
  bankLedger: {
    all: ["admin-bank-ledger"] as const,
    list: (bankId?: string, accountId?: string) =>
      ["admin-bank-ledger", "list", bankId, accountId] as const,
    summary: ({ accountID, bankID }: GetBankLedgerSummaryParams) =>
      ["admin-bank-ledger", "summary", accountID, bankID] as const,
  },
  cashLedger: {
    all: ["admin-cash-ledger"] as const,
    list: (fromAD?: string | null, toAD?: string | null) =>
      ["admin-cash-ledger", "list", fromAD, toAD] as const,
    summary: (fromAD?: string | null, toAD?: string | null) =>
      ["admin-cash-ledger", "summary", fromAD, toAD] as const,
  },
  suppliers: {
    all: ["admin-suppliers"] as const,
    list: (page: number) => ["admin-suppliers", "list", page] as const,
    ledger: {
      summary: ({
        supplierID,
        fromDate,
        toDate,
      }: {
        supplierID: string | null;
        fromDate: string | null;
        toDate: string | null;
      }) =>
        [
          "admin-suppliers",
          "ledger",
          "summary",
          supplierID,
          fromDate,
          toDate,
        ] as const,
      list: (
        supplierID: string,
        page: number,
        fromDate: string | null,
        toDate: string | null,
      ) =>
        [
          "admin-suppliers",
          "ledger",
          "list",
          supplierID,
          page,
          fromDate,
          toDate,
        ] as const,
      all: ["admin-suppliers", "ledger"] as const,
    },
  },
};
