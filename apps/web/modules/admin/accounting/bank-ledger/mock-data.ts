import type {
  BankAccount,
  CreateLedgerEntryInput,
  LedgerEntry,
  LedgerEntryWithAccount,
  LedgerSummary,
} from "./ledger";

// ─── Mock bank accounts ────────────────────────────────────────────────────

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "acc-1",
    bankId: "bank-1",
    bankName: "Nepal Investment Mega Bank",
    accountName: "Main Operating Account",
    accountNumber: "03100012345678",
    isDefault: true,
    createdAt: "2023-01-10T00:00:00Z",
  },
  {
    id: "acc-2",
    bankId: "bank-1",
    bankName: "Nepal Investment Mega Bank",
    accountName: "Fee Collection Account",
    accountNumber: "03100087654321",
    isDefault: false,
    createdAt: "2023-03-15T00:00:00Z",
  },
  {
    id: "acc-3",
    bankId: "bank-2",
    bankName: "Nabil Bank",
    accountName: "Payroll Account",
    accountNumber: "NB20240001122",
    isDefault: false,
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "acc-4",
    bankId: "bank-3",
    bankName: "Himalayan Bank",
    accountName: "Reserve Fund",
    accountNumber: "HBL-00293847",
    isDefault: false,
    createdAt: "2024-01-20T00:00:00Z",
  },
];

// ─── Mock ledger entries ───────────────────────────────────────────────────

export let MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: "le-001",
    bankAccountId: "acc-1",
    date: "2024-04-10T09:30:00Z",
    bsDate: "2081-01-28",
    entryType: "cr",
    amount: 2500000,
    description: "Student fee collection — Batch 2081 Spring",
    paymentId: "pay-201",
    createdAt: "2024-04-10T09:32:00Z",
  },
  {
    id: "le-002",
    bankAccountId: "acc-1",
    date: "2024-04-12T11:00:00Z",
    bsDate: "2081-01-30",
    entryType: "dr",
    amount: 750000,
    description: "Supplier payment — coffee equipment maintenance",
    paymentId: null,
    createdAt: "2024-04-12T11:05:00Z",
  },
  {
    id: "le-003",
    bankAccountId: "acc-2",
    date: "2024-04-15T14:20:00Z",
    bsDate: "2081-02-03",
    entryType: "cr",
    amount: 1875000,
    description: "Fee installment — Barista Professional Programme",
    paymentId: "pay-202",
    createdAt: "2024-04-15T14:22:00Z",
  },
  {
    id: "le-004",
    bankAccountId: "acc-3",
    date: "2024-04-30T10:00:00Z",
    bsDate: "2081-02-17",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Baisakh 2081",
    paymentId: null,
    createdAt: "2024-04-30T10:02:00Z",
  },
  {
    id: "le-005",
    bankAccountId: "acc-1",
    date: "2024-05-05T09:15:00Z",
    bsDate: "2081-02-22",
    entryType: "cr",
    amount: 4500000,
    description: "Student fee collection — Bakery Batch 2081-B",
    paymentId: "pay-203",
    createdAt: "2024-05-05T09:18:00Z",
  },
  {
    id: "le-006",
    bankAccountId: "acc-4",
    date: "2024-05-08T16:00:00Z",
    bsDate: "2081-02-25",
    entryType: "cr",
    amount: 10000000,
    description: "Reserve fund transfer from main account",
    paymentId: null,
    createdAt: "2024-05-08T16:05:00Z",
  },
  {
    id: "le-007",
    bankAccountId: "acc-1",
    date: "2024-05-10T10:30:00Z",
    bsDate: "2081-02-27",
    entryType: "dr",
    amount: 125000,
    description: "Stationery and printing supplies",
    paymentId: null,
    createdAt: "2024-05-10T10:33:00Z",
  },
  {
    id: "le-008",
    bankAccountId: "acc-2",
    date: "2024-05-14T13:45:00Z",
    bsDate: "2081-03-01",
    entryType: "cr",
    amount: 2200000,
    description: "Hospitality Management course fees",
    paymentId: "pay-204",
    createdAt: "2024-05-14T13:47:00Z",
  },
  {
    id: "le-009",
    bankAccountId: "acc-3",
    date: "2024-05-31T10:00:00Z",
    bsDate: "2081-03-17",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Jestha 2081",
    paymentId: null,
    createdAt: "2024-05-31T10:03:00Z",
  },
  {
    id: "le-010",
    bankAccountId: "acc-1",
    date: "2024-06-02T11:00:00Z",
    bsDate: "2081-03-19",
    entryType: "dr",
    amount: 890000,
    description: "Equipment rental — espresso machine lease",
    paymentId: null,
    createdAt: "2024-06-02T11:02:00Z",
  },
  {
    id: "le-011",
    bankAccountId: "acc-2",
    date: "2024-06-05T09:30:00Z",
    bsDate: "2081-03-22",
    entryType: "cr",
    amount: 3750000,
    description: "Bulk admission — corporate training programme",
    paymentId: "pay-205",
    createdAt: "2024-06-05T09:32:00Z",
  },
  {
    id: "le-012",
    bankAccountId: "acc-1",
    date: "2024-06-10T15:00:00Z",
    bsDate: "2081-03-27",
    entryType: "cr",
    amount: 1200000,
    description: "Refund reversal — cancelled enrolment redeposit",
    paymentId: null,
    createdAt: "2024-06-10T15:02:00Z",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function generateMockEntries(): LedgerEntry[] {
//   const entries: LedgerEntry[] = [];
//   const accountIds = MOCK_BANK_ACCOUNTS.map((a) => a.id);
//   const baseDate = new Date("2024-01-01");

//   for (let i = 0; i < 120; i++) {
//     const date = new Date(baseDate);
//     date.setDate(baseDate.getDate() + i);
//     const isoDate = date.toISOString().split("T")[0];
//     const bsDate = `${2080 + Math.floor(i / 365)}-${String(((date.getMonth() + 9) % 12) + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//     entries.push({
//       id: `le-${i + 1}`,
//       bankAccountId: accountIds[i % accountIds.length],
//       date: isoDate,
//       bsDate,
//       entryType: i % 3 === 0 ? "cr" : "dr",
//       amount: Math.floor((Math.random() * 500000 + 10000) * 100), // paisa
//       description: NARRATIONS[i % NARRATIONS.length],
//       paymentId: i % 5 === 0 ? `pay-${i}` : null,
//       createdAt: date.toISOString(),
//     });
//   }

//   // Sort by date desc (matches backend ORDER BY bl.date DESC)
//   return entries.sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
//   );
// }

// ─── Enrichment ──────────────────────────────────────────────────────────────

export function enrichEntry(entry: LedgerEntry): LedgerEntryWithAccount {
  const account = MOCK_BANK_ACCOUNTS.find((a) => a.id === entry.bankAccountId);
  if (!account) {
    throw new Error(`No account found for id ${entry.bankAccountId}`);
  }
  return { ...entry, bankAccount: account };
}

export function computeSummary(entries: LedgerEntry[]): LedgerSummary {
  let totalCr = 0;
  let totalDr = 0;
  for (const e of entries) {
    if (e.entryType === "cr") totalCr += e.amount;
    else totalDr += e.amount;
  }
  return { totalCr, totalDr, netBalance: totalCr - totalDr };
}

// ─── Paginated Fetch (mirrors ListBankLedger + GetBankLedgerSummary) ─────────

export const PAGE_SIZE = 20;

export interface LedgerPageParams {
  bankId?: string;
  accountId?: string;
  page: number; // 0-indexed offset page
}

export interface LedgerPage {
  entries: LedgerEntryWithAccount[];
  totalCount: number;
  nextPage: number | null;
}

export async function fetchLedgerPage(
  params: LedgerPageParams,
): Promise<LedgerPage> {
  await delay(600);

  const filtered = MOCK_LEDGER_ENTRIES.filter((e) => {
    const account = MOCK_BANK_ACCOUNTS.find((a) => a.id === e.bankAccountId);
    if (!account) return false;
    if (
      params.bankId &&
      params.bankId !== "all" &&
      account.bankId !== params.bankId
    )
      return false;
    if (
      params.accountId &&
      params.accountId !== "all" &&
      e.bankAccountId !== params.accountId
    )
      return false;
    return true;
  });

  const totalCount = filtered.length;
  const offset = params.page * PAGE_SIZE;
  const slice = filtered.slice(offset, offset + PAGE_SIZE).map(enrichEntry);
  const nextPage = offset + PAGE_SIZE < totalCount ? params.page + 1 : null;

  return { entries: slice, totalCount, nextPage };
}

export async function fetchLedgerSummary(params: {
  bankId?: string;
  accountId?: string;
}): Promise<LedgerSummary> {
  await delay(300);

  const filtered = MOCK_LEDGER_ENTRIES.filter((e) => {
    const account = MOCK_BANK_ACCOUNTS.find((a) => a.id === e.bankAccountId);
    if (!account) return false;
    if (
      params.bankId &&
      params.bankId !== "all" &&
      account.bankId !== params.bankId
    )
      return false;
    if (
      params.accountId &&
      params.accountId !== "all" &&
      e.bankAccountId !== params.accountId
    )
      return false;
    return true;
  });

  return computeSummary(filtered);
}

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  await delay(300);
  return MOCK_BANK_ACCOUNTS;
}

export async function createLedgerEntry(
  input: CreateLedgerEntryInput,
): Promise<LedgerEntry> {
  await delay(800);
  const newEntry: LedgerEntry = {
    id: `le-${Date.now()}`,
    bankAccountId: input.bankAccountId,
    date: input.date,
    bsDate: input.bsDate,
    entryType: input.entryType,
    amount: Math.round(input.amountRs * 100),
    description: input.description ?? null,
    paymentId: null,
    createdAt: new Date().toISOString(),
  };
  MOCK_LEDGER_ENTRIES = [newEntry, ...MOCK_LEDGER_ENTRIES];
  return newEntry;
}
