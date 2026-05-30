import api from "../axios";
import {
  CreateSupplierInput,
  CreateSupplierResponse,
  DeleteSupplierResponse,
  GetSupplierResponse,
  SuppliersData,
  UpdateSupplierInput,
  UpdateSupplierResponse,
} from "@repo/types";

export const getSuppliers = async (page: number): Promise<SuppliersData> => {
  const res = await api.get<GetSupplierResponse>(
    "/admin/accounting/suppliers",
    {
      params: { page: page.toString() },
    },
  );
  return {
    suppliers: res.data.data,
    meta: res.data.meta,
  };
};

export const createSupplier = async (
  data: CreateSupplierInput,
): Promise<CreateSupplierResponse> => {
  const res = await api.post<CreateSupplierResponse>(
    "/admin/accounting/suppliers",
    data,
  );
  return res.data;
};

type UpdateSupplierParams = {
  supplierID: string;
  data: UpdateSupplierInput;
};
export const updateSupplier = async ({
  supplierID,
  data,
}: UpdateSupplierParams): Promise<UpdateSupplierResponse> => {
  const res = await api.put<UpdateSupplierResponse>(
    `/admin/accounting/suppliers/${supplierID}`,
    data,
  );
  return res.data;
};

export const deleteSupplier = async (
  supplierID: string,
): Promise<DeleteSupplierResponse> => {
  const res = await api.delete<DeleteSupplierResponse>(
    `/admin/accounting/suppliers/${supplierID}`,
  );
  return res.data;
};
