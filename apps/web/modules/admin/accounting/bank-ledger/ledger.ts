export type EntryType = "dr" | "cr";

export type LedgerEntry = {
  id: string;
  bankAccountId: string;
  date: string;
  bsDate: string;
  entryType: EntryType;
  amount: number; // in paisa
  description: string | null;
  paymentId: string | null;
  createdAt: string;
};

export type BankAccount = {
  id: string;
  bankId: string;
  bankName: string;
  accountName: string;
  accountNumber: string | null;
  isDefault: boolean;
  createdAt: string;
};

export type LedgerEntryWithAccount = LedgerEntry & {
  bankAccount: BankAccount;
};

export type LedgerSummary = {
  totalCr: number; // in paisa
  totalDr: number; // in paisa
  netBalance: number; // cr - dr, in paisa
};

export type CreateLedgerEntryInput = {
  bankAccountId: string;
  date: string;
  bsDate: string;
  entryType: EntryType;
  amountRs: number; // in rupees — will multiply by 100 before sending
  description?: string;
};
