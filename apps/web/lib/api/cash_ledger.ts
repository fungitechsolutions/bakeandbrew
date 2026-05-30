import {
  CashLedgerData,
  CashLedgerSummary,
  CreateCashLedgerEntryInput,
  CreateCashLedgerEntryResponse,
  GetCashLedgerResponse,
  GetCashLedgerSummaryResponse,
} from "@repo/types";
import api from "../axios";

type GetCashLedgerParams = {
  page: number;
  fromAD?: string | null;
  toAD?: string | null;
};

export const getCashLedger = async ({
  page = 1,
  fromAD,
  toAD,
}: GetCashLedgerParams): Promise<CashLedgerData> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (fromAD) params.append("from_ad", fromAD);
  if (toAD) params.append("to_ad", toAD);
  const res = await api.get<GetCashLedgerResponse>(
    `/admin/accounting/cash-ledger?${params.toString()}`,
  );
  return {
    cashLedger: res.data.data,
    meta: res.data.meta,
  };
};

type GetCashLedgerSummaryParams = {
  fromAD?: string | null;
  toAD?: string | null;
};

export const getCashLedgerSummary = async ({
  fromAD,
  toAD,
}: GetCashLedgerSummaryParams): Promise<CashLedgerSummary> => {
  const params = new URLSearchParams();
  if (fromAD) params.append("from_ad", fromAD);
  if (toAD) params.append("to_ad", toAD);
  const res = await api.get<GetCashLedgerSummaryResponse>(
    `/admin/accounting/cash-ledger/summary?${params.toString()}`,
  );
  return res.data.data;
};

type CreateCashLedgerEntryParams = {
  data: CreateCashLedgerEntryInput;
};

export const createCashLedgerEntry = async ({
  data,
}: CreateCashLedgerEntryParams): Promise<CreateCashLedgerEntryResponse> => {
  const res = await api.post<CreateCashLedgerEntryResponse>(
    `/admin/accounting/cash-ledger`,
    { ...data, amount: Number(data.amount) },
  );
  return res.data;
};
