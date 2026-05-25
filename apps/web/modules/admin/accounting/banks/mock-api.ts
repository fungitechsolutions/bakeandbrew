import { MOCK_BANKS } from "./mock-data";
import type { Bank, BanksResponse } from "./types";

let store: Bank[] = [...MOCK_BANKS];

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const randomDelay = (min = 600, max = 1200) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);

export const PER_PAGE = 8;

export async function fetchBanks(page = 1): Promise<BanksResponse> {
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

export async function createBank(name: string): Promise<Bank> {
  await randomDelay(400, 800);

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Bank name is required.");
  if (store.some((b) => b.name.toLowerCase() === trimmed.toLowerCase()))
    throw new Error(`A bank named "${trimmed}" already exists.`);

  const bank: Bank = {
    id: crypto.randomUUID(),
    name: trimmed,
    is_default: false,
    created_at: new Date().toISOString(),
  };

  store = [bank, ...store];
  return bank;
}

export async function updateBankName(id: string, name: string): Promise<Bank> {
  await randomDelay(400, 800);

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Bank name is required.");
  if (
    store.some(
      (b) => b.name.toLowerCase() === trimmed.toLowerCase() && b.id !== id,
    )
  )
    throw new Error(`A bank named "${trimmed}" already exists.`);

  store = store.map((b) => (b.id === id ? { ...b, name: trimmed } : b));
  const updated = store.find((b) => b.id === id);
  if (!updated) throw new Error("Bank not found.");
  return updated;
}

export async function toggleDefault(id: string): Promise<Bank[]> {
  await randomDelay(300, 600);

  const target = store.find((b) => b.id === id);
  if (!target) throw new Error("Bank not found.");

  const becomingDefault = !target.is_default;
  store = store.map((b) => ({
    ...b,
    is_default:
      b.id === id ? becomingDefault : becomingDefault ? false : b.is_default,
  }));

  return store;
}

export async function deleteBank(id: string): Promise<void> {
  await randomDelay(400, 800);
  store = store.filter((b) => b.id !== id);
}
