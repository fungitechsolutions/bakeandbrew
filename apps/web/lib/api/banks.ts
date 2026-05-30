import {
  Bank,
  GetBanksResponse,
  PaginationMeta,
  CreateBankInput,
  CreateBankResponse,
  DeleteBankResponse,
  SetDefaultBankResponse,
  UpdateBankInput,
  UpdateBankResponse,
} from "@repo/types";
import api from "../axios";

export type BanksData = {
  banks: Bank[];
  meta: PaginationMeta;
};
export const fetchBanks = async (page: number): Promise<BanksData> => {
  const res = await api.get<GetBanksResponse>(
    `/admin/accounting/banks?page=${page}`,
  );
  return {
    banks: res.data.data,
    meta: res.data.meta,
  };
};

export const createBank = async (
  data: CreateBankInput,
): Promise<CreateBankResponse> => {
  const res = await api.post<CreateBankResponse>(
    "/admin/accounting/banks",
    data,
  );
  return res.data;
};

export const updateBank = async (
  data: UpdateBankInput,
  bankID: string,
): Promise<UpdateBankResponse> => {
  const res = await api.put<UpdateBankResponse>(
    `/admin/accounting/banks/${bankID}`,
    data,
  );

  return res.data;
};

export const deleteBank = async (
  bankID: string,
): Promise<DeleteBankResponse> => {
  const res = await api.delete<DeleteBankResponse>(
    `/admin/accounting/banks/${bankID}`,
  );
  return res.data;
};

export const setDefaultBank = async (
  bankID: string,
): Promise<SetDefaultBankResponse> => {
  const res = await api.put(`/admin/accounting/banks/${bankID}/set-default`);
  return res.data;
};
