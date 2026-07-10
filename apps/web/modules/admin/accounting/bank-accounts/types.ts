export interface BankAccount {
  id: string;
  bank_id: string;
  bank_name: string;
  account_name: string;
  account_number: string | null;
  is_default: boolean;
  created_at: string;
}

export interface BankAccountsResponse {
  data: BankAccount[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface BankOption {
  id: string;
  name: string;
}
