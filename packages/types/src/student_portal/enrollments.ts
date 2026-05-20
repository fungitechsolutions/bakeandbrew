import z from "zod";

export const getStudentCoursesResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.array(
      z.object({
        name: z.string(),
        feeAtEnrollment: z.number(),
        slug: z.string(),
        id: z.uuid(),
      }),
    ),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
    code: z.string(),
  }),
]);

export type GetStudentCoursesResponse = z.infer<
  typeof getStudentCoursesResponseSchema
>;
