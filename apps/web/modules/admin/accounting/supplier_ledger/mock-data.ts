import {
  Supplier,
  SupplierLedger,
  SupplierLedgerSummary,
  SupplierForDropdown,
} from "./types";

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    companyName: "Nepal Trading Co.",
    vatNo: "300123456",
    phone: "9841000001",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "sup-2",
    companyName: "Himalayan Supplies Pvt. Ltd.",
    vatNo: "300987654",
    phone: "9841000002",
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "sup-3",
    companyName: "Kathmandu Distributors",
    vatNo: null,
    phone: "9841000003",
    createdAt: "2024-03-20T00:00:00Z",
  },
  {
    id: "sup-4",
    companyName: "Everest Wholesale",
    vatNo: "300112233",
    phone: null,
    createdAt: "2024-04-01T00:00:00Z",
  },
];

export const mockSuppliersDropdown: SupplierForDropdown[] = mockSuppliers.map(
  (s) => ({ id: s.id, companyName: s.companyName }),
);

export const mockSupplierLedgerEntries: SupplierLedger[] = [
  {
    id: "sl-1",
    supplierId: "sup-1",
    supplierName: "Nepal Trading Co.",
    date: "2024-04-13T00:00:00Z",
    bsDate: "2081-01-01",
    entryType: "cr",
    amount: 25000000,
    description: "Stock purchased - Invoice #1023",
    stockInId: "si-001",
    createdAt: "2024-04-13T00:00:00Z",
  },
  {
    id: "sl-2",
    supplierId: "sup-2",
    supplierName: "Himalayan Supplies Pvt. Ltd.",
    date: "2024-04-14T00:00:00Z",
    bsDate: "2081-01-02",
    entryType: "cr",
    amount: 12000000,
    description: "Stock purchased - Invoice #0455",
    stockInId: "si-002",
    createdAt: "2024-04-14T00:00:00Z",
  },
  {
    id: "sl-3",
    supplierId: "sup-1",
    supplierName: "Nepal Trading Co.",
    date: "2024-04-15T00:00:00Z",
    bsDate: "2081-01-03",
    entryType: "dr",
    amount: 10000000,
    description: "Payment made - cheque #887",
    stockInId: null,
    createdAt: "2024-04-15T00:00:00Z",
  },
  {
    id: "sl-4",
    supplierId: "sup-3",
    supplierName: "Kathmandu Distributors",
    date: "2024-04-16T00:00:00Z",
    bsDate: "2081-01-04",
    entryType: "cr",
    amount: 8500000,
    description: "Stock purchased - Invoice #0789",
    stockInId: "si-003",
    createdAt: "2024-04-16T00:00:00Z",
  },
  {
    id: "sl-5",
    supplierId: "sup-2",
    supplierName: "Himalayan Supplies Pvt. Ltd.",
    date: "2024-04-17T00:00:00Z",
    bsDate: "2081-01-05",
    entryType: "dr",
    amount: 12000000,
    description: "Full payment settled",
    stockInId: null,
    createdAt: "2024-04-17T00:00:00Z",
  },
];

export const mockSupplierLedgerSummary: SupplierLedgerSummary = {
  totalCr: 45500000,
  totalDr: 22000000,
  balance: 23500000, // amount still payable
};
