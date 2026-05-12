import api from "@/lib/axios";
import type {
  APIResponse,
  OutstandingFilters,
  OutstandingResponse,
} from "../types/outstanding";

export async function fetchOutstandingStudents(
  filters: OutstandingFilters,
): Promise<APIResponse<OutstandingResponse>> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.search) params.set("search", filters.search);

  const res = await api.get(`/admin/students/outstanding?${params.toString()}`);

  if (!res.data) {
    throw new Error("Failed to fetch outstanding students");
  }

  return res.data as Promise<APIResponse<OutstandingResponse>>;
}
