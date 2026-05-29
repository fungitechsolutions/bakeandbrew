import {
  BankAccountForDropdown,
  BankLedgerData,
  BankLedgerSummary,
  CreateBankLedgerEntryInput,
  CreateBankLedgerEntryResponse,
  GetBankAccountsForDropdownResponse,
  GetBankLedgerResponse,
  GetBankLedgerSummaryRepsonse,
} from "@repo/types";
import api from "../axios";

type GetBankLedgerParams = {
  page: number;
  bankID?: string;
  accountID?: string;
};
export const getBankLedger = async ({
  page = 1,
  bankID,
  accountID,
}: GetBankLedgerParams): Promise<BankLedgerData> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (bankID && bankID !== "all") params.append("bank_id", bankID);
  if (accountID && accountID !== "all") params.append("account_id", accountID);
  const res = await api.get<GetBankLedgerResponse>(
    `/admin/accounting/banks/ledger?${params.toString()}`,
  );
  return {
    bankLedger: res.data.data,
    meta: res.data.meta,
  };
};

export type GetBankLedgerSummaryParams = {
  bankID?: string;
  accountID?: string;
};
export const getBankLedgerSummary = async ({
  bankID,
  accountID,
}: GetBankLedgerSummaryParams): Promise<BankLedgerSummary> => {
  const params = new URLSearchParams();
  if (bankID && bankID !== "all") params.append("bank_id", bankID);
  if (accountID && accountID !== "all") params.append("account_id", accountID);
  const res = await api.get<GetBankLedgerSummaryRepsonse>(
    "/admin/accounting/banks/ledger/summary",
  );
  return res.data.data;
};

export const getBankAccountsForDropdown = async (): Promise<
  BankAccountForDropdown[]
> => {
  const res = await api.get<GetBankAccountsForDropdownResponse>(
    "/admin/accounting/banks/accounts/dropdown",
  );
  return res.data.data;
};

type CreateBankLedgerParams = {
  data: CreateBankLedgerEntryInput;
  accountID: string;
};
export const createBankLedger = async ({
  accountID,
  data,
}: CreateBankLedgerParams): Promise<CreateBankLedgerEntryResponse> => {
  const res = await api.post<CreateBankLedgerEntryResponse>(
    `/admin/accounting/banks/ledger/${accountID}`,
    { ...data, amount: Number(data.amount) },
  );
  return res.data;
};
