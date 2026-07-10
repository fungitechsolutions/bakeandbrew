export interface Bank {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface BanksResponse {
  data: Bank[];
  meta: PaginationMeta;
}

export interface ApiError {
  message: string;
  code?: string;
}
