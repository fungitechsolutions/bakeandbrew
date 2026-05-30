import z from "zod";
import { paginationMetaSchema } from "../../base";

const supplierLedgerSchema = z.object({
  id: z.uuid(),
  supplierID: z.uuid().optional(),
  date: z.string(),
  bsDate: z.string(),
  entryType: z.enum(["cr", "dr"]),
  amount: z.number(),
  description: z.string().optional(),
  stockInId: z.uuid().optional(),
  createdAt: z.string(),
  companyName: z.string(),
});
export type SupplierLedger = z.infer<typeof supplierLedgerSchema>;

export const getSupplierLedgerResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(supplierLedgerSchema),
  meta: paginationMetaSchema,
});

export type GetSupplierLedgerResponse = z.infer<
  typeof getSupplierLedgerResponseSchema
>;

export const supplierLedgerData = z.object({
  supplierLedger: z.array(supplierLedgerSchema),
  meta: paginationMetaSchema,
});

export type SupplierLedgerData = z.infer<typeof supplierLedgerData>;

const supplierLedgerSummarySchema = z.object({
  totalCr: z.number(),
  totalDr: z.number(),
  outstanding: z.number(),
});

export type SupplierLedgerSummary = z.infer<typeof supplierLedgerSummarySchema>;

export const getSupplierLedgerSummaryResponse = z.object({
  success: z.literal(true),
  data: supplierLedgerSummarySchema,
});

export type GetSupplierLedgerSummaryResponse = z.infer<
  typeof getSupplierLedgerSummaryResponse
>;

export const createSupplierLedgerEntryInput = z.object({
  date: z.date(),
  bsDate: z.string(),
  entryType: z.enum(["cr", "dr"]),
  amount: z.number(),
  description: z.string(),
});

export type CreateSupplierLedgerEntryInput = z.infer<
  typeof createSupplierLedgerEntryInput
>;

export const createSupplierLedgerEntryResponse = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type CreateSupplierLedgerEntryResponse = z.infer<
  typeof createSupplierLedgerEntryResponse
>;
