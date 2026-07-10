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
  {
    id: "le-013",
    bankAccountId: "acc-1",
    date: "2024-06-12T10:00:00Z",
    bsDate: "2081-03-29",
    entryType: "cr",
    amount: 3100000,
    description: "Student fee collection — Culinary Arts Batch 2081-C",
    paymentId: "pay-206",
    createdAt: "2024-06-12T10:02:00Z",
  },
  {
    id: "le-014",
    bankAccountId: "acc-2",
    date: "2024-06-14T14:15:00Z",
    bsDate: "2081-03-31",
    entryType: "dr",
    amount: 420000,
    description: "Marketing campaign expense — social media ads",
    paymentId: null,
    createdAt: "2024-06-14T14:18:00Z",
  },
  {
    id: "le-015",
    bankAccountId: "acc-3",
    date: "2024-06-18T09:45:00Z",
    bsDate: "2081-04-04",
    entryType: "cr",
    amount: 1500000,
    description: "Government subsidy credit — training support fund",
    paymentId: null,
    createdAt: "2024-06-18T09:47:00Z",
  },
  {
    id: "le-016",
    bankAccountId: "acc-1",
    date: "2024-06-20T11:30:00Z",
    bsDate: "2081-04-06",
    entryType: "dr",
    amount: 980000,
    description: "Utility bills — electricity and water",
    paymentId: null,
    createdAt: "2024-06-20T11:32:00Z",
  },
  {
    id: "le-017",
    bankAccountId: "acc-4",
    date: "2024-06-22T16:00:00Z",
    bsDate: "2081-04-08",
    entryType: "dr",
    amount: 2500000,
    description: "Reserve fund reallocation — infrastructure upgrade",
    paymentId: null,
    createdAt: "2024-06-22T16:03:00Z",
  },
  {
    id: "le-018",
    bankAccountId: "acc-2",
    date: "2024-06-25T10:20:00Z",
    bsDate: "2081-04-11",
    entryType: "cr",
    amount: 2750000,
    description: "Course fee collection — Advanced Barista Programme",
    paymentId: "pay-207",
    createdAt: "2024-06-25T10:22:00Z",
  },
  {
    id: "le-019",
    bankAccountId: "acc-1",
    date: "2024-06-28T13:00:00Z",
    bsDate: "2081-04-14",
    entryType: "dr",
    amount: 135000,
    description: "Office supplies restock",
    paymentId: null,
    createdAt: "2024-06-28T13:02:00Z",
  },
  {
    id: "le-020",
    bankAccountId: "acc-3",
    date: "2024-06-30T09:00:00Z",
    bsDate: "2081-04-16",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Ashadh 2081",
    paymentId: null,
    createdAt: "2024-06-30T09:03:00Z",
  },
  {
    id: "le-021",
    bankAccountId: "acc-1",
    date: "2024-07-03T10:30:00Z",
    bsDate: "2081-04-19",
    entryType: "cr",
    amount: 5000000,
    description: "Student fee collection — Summer Intake 2081",
    paymentId: "pay-208",
    createdAt: "2024-07-03T10:33:00Z",
  },
  {
    id: "le-022",
    bankAccountId: "acc-2",
    date: "2024-07-06T14:00:00Z",
    bsDate: "2081-04-22",
    entryType: "dr",
    amount: 600000,
    description: "Equipment maintenance — kitchen appliances",
    paymentId: null,
    createdAt: "2024-07-06T14:02:00Z",
  },
  {
    id: "le-023",
    bankAccountId: "acc-1",
    date: "2024-07-09T11:15:00Z",
    bsDate: "2081-04-25",
    entryType: "cr",
    amount: 1800000,
    description: "Short course fee collection — Baking Basics",
    paymentId: "pay-209",
    createdAt: "2024-07-09T11:17:00Z",
  },
  {
    id: "le-024",
    bankAccountId: "acc-4",
    date: "2024-07-12T16:30:00Z",
    bsDate: "2081-04-28",
    entryType: "cr",
    amount: 7000000,
    description: "Capital infusion — strategic reserve top-up",
    paymentId: null,
    createdAt: "2024-07-12T16:33:00Z",
  },
  {
    id: "le-025",
    bankAccountId: "acc-3",
    date: "2024-07-15T09:00:00Z",
    bsDate: "2081-05-01",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Shrawan 2081",
    paymentId: null,
    createdAt: "2024-07-15T09:03:00Z",
  },
  {
    id: "le-026",
    bankAccountId: "acc-1",
    date: "2024-07-18T10:45:00Z",
    bsDate: "2081-05-04",
    entryType: "dr",
    amount: 450000,
    description: "Facility cleaning and maintenance services",
    paymentId: null,
    createdAt: "2024-07-18T10:47:00Z",
  },
  {
    id: "le-027",
    bankAccountId: "acc-2",
    date: "2024-07-21T13:20:00Z",
    bsDate: "2081-05-07",
    entryType: "cr",
    amount: 2600000,
    description: "Corporate training batch fee inflow",
    paymentId: "pay-210",
    createdAt: "2024-07-21T13:22:00Z",
  },
  {
    id: "le-028",
    bankAccountId: "acc-1",
    date: "2024-07-24T11:00:00Z",
    bsDate: "2081-05-10",
    entryType: "dr",
    amount: 220000,
    description: "Internet and communication expenses",
    paymentId: null,
    createdAt: "2024-07-24T11:02:00Z",
  },
  {
    id: "le-029",
    bankAccountId: "acc-3",
    date: "2024-07-27T09:30:00Z",
    bsDate: "2081-05-13",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Bhadra 2081 (advance)",
    paymentId: null,
    createdAt: "2024-07-27T09:33:00Z",
  },
  {
    id: "le-030",
    bankAccountId: "acc-1",
    date: "2024-07-30T10:10:00Z",
    bsDate: "2081-05-16",
    entryType: "cr",
    amount: 3900000,
    description: "Student fee collection — Hospitality Diploma Batch",
    paymentId: "pay-211",
    createdAt: "2024-07-30T10:12:00Z",
  },
  {
    id: "le-031",
    bankAccountId: "acc-2",
    date: "2024-08-02T14:40:00Z",
    bsDate: "2081-05-19",
    entryType: "dr",
    amount: 510000,
    description: "Software licensing and LMS subscription renewal",
    paymentId: null,
    createdAt: "2024-08-02T14:42:00Z",
  },
  {
    id: "le-032",
    bankAccountId: "acc-4",
    date: "2024-08-05T16:00:00Z",
    bsDate: "2081-05-22",
    entryType: "dr",
    amount: 1200000,
    description: "Reserve fund adjustment — liquidity balancing",
    paymentId: null,
    createdAt: "2024-08-05T16:02:00Z",
  },
  {
    id: "le-033",
    bankAccountId: "acc-1",
    date: "2024-08-08T10:00:00Z",
    bsDate: "2081-05-25",
    entryType: "cr",
    amount: 2800000,
    description: "Student fee collection — Culinary Intake Batch 2081-D",
    paymentId: "pay-212",
    createdAt: "2024-08-08T10:02:00Z",
  },
  {
    id: "le-034",
    bankAccountId: "acc-2",
    date: "2024-08-10T13:30:00Z",
    bsDate: "2081-05-27",
    entryType: "dr",
    amount: 340000,
    description: "Digital marketing — Google Ads campaign",
    paymentId: null,
    createdAt: "2024-08-10T13:32:00Z",
  },
  {
    id: "le-035",
    bankAccountId: "acc-3",
    date: "2024-08-12T09:00:00Z",
    bsDate: "2081-05-29",
    entryType: "cr",
    amount: 1600000,
    description: "Government incentive — vocational training support",
    paymentId: null,
    createdAt: "2024-08-12T09:03:00Z",
  },
  {
    id: "le-036",
    bankAccountId: "acc-1",
    date: "2024-08-14T11:45:00Z",
    bsDate: "2081-06-01",
    entryType: "dr",
    amount: 780000,
    description: "Equipment repair — espresso machines overhaul",
    paymentId: null,
    createdAt: "2024-08-14T11:47:00Z",
  },
  {
    id: "le-037",
    bankAccountId: "acc-4",
    date: "2024-08-16T16:10:00Z",
    bsDate: "2081-06-03",
    entryType: "cr",
    amount: 5500000,
    description: "Reserve fund transfer — annual allocation top-up",
    paymentId: null,
    createdAt: "2024-08-16T16:12:00Z",
  },
  {
    id: "le-038",
    bankAccountId: "acc-2",
    date: "2024-08-18T10:20:00Z",
    bsDate: "2081-06-05",
    entryType: "cr",
    amount: 2100000,
    description: "Short course fees — Advanced Culinary Workshop",
    paymentId: "pay-213",
    createdAt: "2024-08-18T10:22:00Z",
  },
  {
    id: "le-039",
    bankAccountId: "acc-1",
    date: "2024-08-20T12:00:00Z",
    bsDate: "2081-06-07",
    entryType: "dr",
    amount: 310000,
    description: "Office rent — monthly payment",
    paymentId: null,
    createdAt: "2024-08-20T12:02:00Z",
  },
  {
    id: "le-040",
    bankAccountId: "acc-3",
    date: "2024-08-22T09:30:00Z",
    bsDate: "2081-06-09",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Bhadra 2081",
    paymentId: null,
    createdAt: "2024-08-22T09:33:00Z",
  },
  {
    id: "le-041",
    bankAccountId: "acc-1",
    date: "2024-08-24T10:15:00Z",
    bsDate: "2081-06-11",
    entryType: "cr",
    amount: 4200000,
    description: "Student fee collection — Hospitality Management Batch",
    paymentId: "pay-214",
    createdAt: "2024-08-24T10:18:00Z",
  },
  {
    id: "le-042",
    bankAccountId: "acc-2",
    date: "2024-08-26T14:50:00Z",
    bsDate: "2081-06-13",
    entryType: "dr",
    amount: 670000,
    description: "Kitchen inventory purchase — raw materials",
    paymentId: null,
    createdAt: "2024-08-26T14:52:00Z",
  },
  {
    id: "le-043",
    bankAccountId: "acc-1",
    date: "2024-08-28T11:00:00Z",
    bsDate: "2081-06-15",
    entryType: "dr",
    amount: 150000,
    description: "Staff training workshop expenses",
    paymentId: null,
    createdAt: "2024-08-28T11:02:00Z",
  },
  {
    id: "le-044",
    bankAccountId: "acc-4",
    date: "2024-08-30T16:00:00Z",
    bsDate: "2081-06-17",
    entryType: "cr",
    amount: 3000000,
    description: "Investment return — fixed deposit interest",
    paymentId: null,
    createdAt: "2024-08-30T16:03:00Z",
  },
  {
    id: "le-045",
    bankAccountId: "acc-2",
    date: "2024-09-02T10:30:00Z",
    bsDate: "2081-06-20",
    entryType: "cr",
    amount: 2400000,
    description: "Course fee inflow — Barista Certification Program",
    paymentId: "pay-215",
    createdAt: "2024-09-02T10:32:00Z",
  },
  {
    id: "le-046",
    bankAccountId: "acc-3",
    date: "2024-09-04T09:00:00Z",
    bsDate: "2081-06-22",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Ashwin 2081 advance",
    paymentId: null,
    createdAt: "2024-09-04T09:03:00Z",
  },
  {
    id: "le-047",
    bankAccountId: "acc-1",
    date: "2024-09-06T13:15:00Z",
    bsDate: "2081-06-24",
    entryType: "cr",
    amount: 1750000,
    description: "Late fee collection — penalty recoveries",
    paymentId: "pay-216",
    createdAt: "2024-09-06T13:17:00Z",
  },
  {
    id: "le-048",
    bankAccountId: "acc-1",
    date: "2024-09-08T11:30:00Z",
    bsDate: "2081-06-26",
    entryType: "dr",
    amount: 600000,
    description: "Infrastructure maintenance — plumbing and repairs",
    paymentId: null,
    createdAt: "2024-09-08T11:32:00Z",
  },
  {
    id: "le-049",
    bankAccountId: "acc-2",
    date: "2024-09-10T15:00:00Z",
    bsDate: "2081-06-28",
    entryType: "cr",
    amount: 1950000,
    description: "Short course enrollment — Baking & Pastry Arts",
    paymentId: "pay-217",
    createdAt: "2024-09-10T15:02:00Z",
  },
  {
    id: "le-050",
    bankAccountId: "acc-4",
    date: "2024-09-12T16:45:00Z",
    bsDate: "2081-06-30",
    entryType: "dr",
    amount: 2200000,
    description: "Reserve fund rebalancing — liquidity allocation",
    paymentId: null,
    createdAt: "2024-09-12T16:47:00Z",
  },
  {
    id: "le-051",
    bankAccountId: "acc-1",
    date: "2024-09-15T10:00:00Z",
    bsDate: "2081-07-03",
    entryType: "cr",
    amount: 5100000,
    description: "Student fee collection — new semester intake",
    paymentId: "pay-218",
    createdAt: "2024-09-15T10:03:00Z",
  },
  {
    id: "le-052",
    bankAccountId: "acc-3",
    date: "2024-09-17T09:30:00Z",
    bsDate: "2081-07-05",
    entryType: "dr",
    amount: 3200000,
    description: "Staff payroll disbursement — Kartik 2081",
    paymentId: null,
    createdAt: "2024-09-17T09:33:00Z",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
