import { MOCK_BANK_ACCOUNTS, MOCK_BANK_OPTIONS } from "./mock-data";
import type { BankAccount, BankAccountsResponse, BankOption } from "./types";

let store: BankAccount[] = [...MOCK_BANK_ACCOUNTS];

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomDelay = (min = 600, max = 1200) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);

export const PER_PAGE = 8;

export async function fetchBankAccounts(
  page = 1,
): Promise<BankAccountsResponse> {
  await randomDelay();

  const total = store.length;
  const total_pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), total_pages);
  const start = (safePage - 1) * PER_PAGE;
  const data = store.slice(start, start + PER_PAGE);

  return {
    data,
    meta: { page: safePage, per_page: PER_PAGE, total, total_pages },
  };
}

export async function fetchBankOptions(): Promise<BankOption[]> {
  await delay(300);
  return [...MOCK_BANK_OPTIONS];
}

export interface CreateBankAccountPayload {
  bank_id: string;
  account_name: string;
  account_number: string | null;
}

export async function createBankAccount(
  payload: CreateBankAccountPayload,
): Promise<BankAccount> {
  await randomDelay(400, 800);

  const { bank_id, account_number } = payload;
  const account_name = payload.account_name.trim();

  if (!account_name) throw new Error("Account name is required.");
  if (!bank_id) throw new Error("Bank is required.");

  const bank = MOCK_BANK_OPTIONS.find((b) => b.id === bank_id);
  if (!bank) throw new Error("Selected bank not found.");

  const duplicate = store.some(
    (a) =>
      a.bank_id === bank_id &&
      a.account_name.toLowerCase() === account_name.toLowerCase(),
  );
  if (duplicate)
    throw new Error(
      `An account named "${account_name}" already exists for this bank.`,
    );

  const account: BankAccount = {
    id: crypto.randomUUID(),
    bank_id,
    bank_name: bank.name,
    account_name,
    account_number: account_number?.trim() || null,
    is_default: false,
    created_at: new Date().toISOString(),
  };

  store = [account, ...store];
  return account;
}

export interface UpdateBankAccountPayload {
  account_name: string;
  account_number: string | null;
}

export async function updateBankAccount(
  id: string,
  payload: UpdateBankAccountPayload,
): Promise<BankAccount> {
  await randomDelay(400, 800);

  const account_name = payload.account_name.trim();
  if (!account_name) throw new Error("Account name is required.");

  const target = store.find((a) => a.id === id);
  if (!target) throw new Error("Account not found.");

  const duplicate = store.some(
    (a) =>
      a.id !== id &&
      a.bank_id === target.bank_id &&
      a.account_name.toLowerCase() === account_name.toLowerCase(),
  );
  if (duplicate)
    throw new Error(
      `An account named "${account_name}" already exists for this bank.`,
    );

  store = store.map((a) =>
    a.id === id
      ? {
          ...a,
          account_name,
          account_number: payload.account_number?.trim() || null,
        }
      : a,
  );

  return store.find((a) => a.id === id)!;
}

export async function toggleAccountDefault(id: string): Promise<void> {
  await randomDelay(300, 600);

  const target = store.find((a) => a.id === id);
  if (!target) throw new Error("Account not found.");

  const becomingDefault = !target.is_default;
  store = store.map((a) => ({
    ...a,
    is_default:
      a.id === id ? becomingDefault : becomingDefault ? false : a.is_default,
  }));
}

export async function deleteBankAccount(id: string): Promise<void> {
  await randomDelay(400, 800);
  store = store.filter((a) => a.id !== id);
}
