import z from "zod";

export const getStudentPaymentsResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.array(
        z.object({
          id: z.uuid(),
          amount: z.number(),
          paymentMode: z.string(),
          remarks: z.string().optional(),
          addedAt: z.string(),
        }),
      ),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentPaymentsResponse = z.infer<
  typeof getStudentPaymentsResponseSchema
>;

export const getStudentFeeSummaryResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.object({
        totalFee: z.number(),
        totalPaid: z.number(),
        remaining: z.number(),
        coursesCount: z.number(),
      }),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentFeeSummaryResponse = z.infer<
  typeof getStudentFeeSummaryResponseSchema
>;
