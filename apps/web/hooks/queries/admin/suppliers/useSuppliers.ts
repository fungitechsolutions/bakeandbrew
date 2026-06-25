import { getSuppliers } from "@/lib/api/supplier";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError, SuppliersData } from "@repo/types";

export const useSuppliers = (page: number = 1) => {
  return useQuery<SuppliersData, AxiosError<APIError>>({
    queryKey: queryKeys.suppliers.list(page),
    queryFn: () => getSuppliers(page),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};
