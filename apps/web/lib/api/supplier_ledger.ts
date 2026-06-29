import {
  CreateSupplierLedgerEntryInput,
  CreateSupplierLedgerEntryResponse,
  GetSupplierLedgerResponse,
  GetSupplierLedgerSummaryResponse,
  SupplierLedgerSummary,
} from "@repo/types";
import api from "../axios";

export const getSupplierLedger = async (
  page: number,
  {
    supplierID,
    fromDate,
    toDate,
  }: {
    supplierID: string | null;
    fromDate: string | null;
    toDate: string | null;
  },
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (supplierID && supplierID !== "all")
    params.append("supplier_id", supplierID);
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  const res = await api.get<GetSupplierLedgerResponse>(
    `/admin/accounting/suppliers/ledger?${params.toString()}`,
  );
  return {
    supplierLedger: res.data.data,
    meta: res.data.meta,
  };
};

export const getSupplierLedgerSummary = async ({
  supplierID,
  fromDate,
  toDate,
}: {
  supplierID: string | null;
  fromDate: string | null;
  toDate: string | null;
}): Promise<SupplierLedgerSummary> => {
  const params = new URLSearchParams();
  if (supplierID && supplierID !== "all")
    params.append("supplier_id", supplierID);
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  const res = await api.get<GetSupplierLedgerSummaryResponse>(
    `/admin/accounting/suppliers/ledger/summary?${params.toString()}`,
  );
  return res.data.data;
};

export const createSupplierLedger = async (
  supplierID: string,
  data: CreateSupplierLedgerEntryInput,
): Promise<CreateSupplierLedgerEntryResponse> => {
  // console.log("supplierID", supplierID);
  const res = await api.post<CreateSupplierLedgerEntryResponse>(
    `/admin/accounting/suppliers/${supplierID}/ledger`,
    data,
  );
  return res.data;
};
