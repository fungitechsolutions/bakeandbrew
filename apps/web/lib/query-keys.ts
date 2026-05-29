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
};
