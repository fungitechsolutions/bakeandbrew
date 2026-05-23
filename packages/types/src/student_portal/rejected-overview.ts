import z from "zod";

export const getStudentRejectedOverviewResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.object({
        fullName: z.string(),
        rejectionReason: z.string(),
        decidedAt: z.string(),
      }),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentRejectedOverviewResponse = z.infer<
  typeof getStudentRejectedOverviewResponseSchema
>;
