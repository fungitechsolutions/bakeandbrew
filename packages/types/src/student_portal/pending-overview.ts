import z from "zod";

export const getStudentPendingOverviewResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.object({
        fullName: z.string(),
        submittedAt: z.string(),
      }),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentPendingOverviewResponse = z.infer<
  typeof getStudentPendingOverviewResponseSchema
>;
