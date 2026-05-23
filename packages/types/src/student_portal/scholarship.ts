import z from "zod";

export const getStudentScholarshipResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z
        .object({
          note: z.string(),
          amount: z.number(),
          percent: z.number(),
          createdAt: z.string(),
        })
        .nullable(),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentPortalScholarshipResponse = z.infer<
  typeof getStudentScholarshipResponseSchema
>;
