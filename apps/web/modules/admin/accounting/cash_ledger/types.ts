// Add these to @repo/types

export interface CashLedger {
  id: string;
  date: string; // ISO AD date
  bsDate: string; // Nepali BS date string e.g. "2081-01-15"
  entryType: "dr" | "cr";
  amount: number; // in paisa
  description: string | undefined;
  paymentId: string | undefined;
  createdAt: string;
}

export interface CashLedgerSummary {
  totalDr: number; // paisa
  totalCr: number; // paisa
  balance: number; // paisa (cr - dr)
}

export interface CashLedgerData {
  cashLedger: CashLedger[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface CreateCashLedgerEntryInput {
  date: string; // ISO AD date sent to backend
  bsDate: string; // BS date for display
  entryType: "dr" | "cr";
  amount: number; // paisa
  description?: string;
}

export interface CashLedgerFilters {
  fromDate: string | null; // AD ISO — sent to backend
  toDate: string | null; // AD ISO — sent to backend
  fromBsDate: string | null; // BS — shown in URL/UI
  toBsDate: string | null; // BS — shown in URL/UI
}
