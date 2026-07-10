import z from "zod";

const batchResponseSchema = z.string();

export type BatchResponse = z.infer<typeof batchResponseSchema>;

export const getDistinctBatchesResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(batchResponseSchema),
});

export type GetDistinctBatchesResponse = z.infer<
  typeof getDistinctBatchesResponseSchema
>;
