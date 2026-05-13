import api from "@/lib/axios";
import type { APIResponse, SalesFilters, SalesResponse } from "../types/sales";

export async function fetchSalesRevenue(
  filters: SalesFilters,
): Promise<APIResponse<SalesResponse>> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  // if (filters.search) params.set("search", filters.search);

  const res = await api.get(`/admin/students/sales?${params.toString()}`);

  if (!res.data || !res.data.success) {
    throw new Error("Failed to fetch sales revenue");
  }

  return res.data as Promise<APIResponse<SalesResponse>>;
}
