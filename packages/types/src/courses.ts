import z from "zod";

const courseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  fee: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export const coursesList = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),

    data: z.array(
      z.object({ id: z.uuid(), name: z.string(), fee: z.number() }),
    ),
  }),

  z.object({
    success: z.literal(false),
    message: z.string(),
    code: z.string(),
  }),
]);

export type CoursesList = z.infer<typeof coursesList>;

export const CourseDetailSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: courseSchema,
  }),

  z.object({
    success: z.literal(false),
    message: z.string(),
    code: z.string(),
  }),
]);

export type CourseDetailResponse = z.infer<typeof CourseDetailSchema>;
