import z from "zod";
import { paginationMetaSchema } from "../../base";

const bankSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export type Bank = z.infer<typeof bankSchema>;

export const getBanksResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(bankSchema),
  meta: paginationMetaSchema,
});

export type GetBanksResponse = z.infer<typeof getBanksResponseSchema>;

export const createBankInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type CreateBankInput = z.infer<typeof createBankInputSchema>;

export const createBankResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: bankSchema,
});

export type CreateBankResponse = z.infer<typeof createBankResponseSchema>;

export const updateBankInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export type UpdateBankInput = z.infer<typeof updateBankInputSchema>;

export const updateBankResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type UpdateBankResponse = z.infer<typeof updateBankResponseSchema>;

export const deleteBankResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type DeleteBankResponse = z.infer<typeof deleteBankResponseSchema>;

export const setDefaultBankResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type SetDefaultBankResponse = z.infer<
  typeof setDefaultBankResponseSchema
>;
