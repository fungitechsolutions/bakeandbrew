// Add these to @repo/types

export interface Supplier {
  id: string;
  companyName: string;
  vatNo: string | null;
  phone: string | null;
  createdAt: string;
}

export interface SupplierForDropdown {
  id: string;
  companyName: string;
}

export interface CreateSupplierInput {
  companyName: string;
  vatNo?: string;
  phone?: string;
}

export interface UpdateSupplierInput {
  companyName?: string;
  vatNo?: string;
  phone?: string;
}

export interface SupplierPaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface SuppliersData {
  suppliers: Supplier[];
  meta: SupplierPaginationMeta;
}

// ── Supplier Ledger ───────────────────────────────────────────────────────────

export interface SupplierLedger {
  id: string;
  supplierId: string;
  supplierName: string; // joined from suppliers table
  date: string; // ISO AD
  bsDate: string; // BS date string
  entryType: "dr" | "cr";
  amount: number; // paisa
  description: string | null;
  stockInId: string | null;
  createdAt: string;
}

export interface SupplierLedgerSummary {
  totalDr: number; // paisa
  totalCr: number; // paisa
  balance: number; // paisa (dr - cr → payable)
}

export interface SupplierLedgerData {
  supplierLedger: SupplierLedger[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface CreateSupplierLedgerEntryInput {
  supplierId: string;
  date: string; // ISO AD — sent to backend
  bsDate: string; // BS — for display
  entryType: "dr" | "cr";
  amount: number; // paisa
  description?: string;
}

export interface SupplierLedgerFilters {
  supplierId: string;
  supplierName: string;
  fromDate: string | null;
  toDate: string | null;
  fromBsDate: string | null;
  toBsDate: string | null;
}
