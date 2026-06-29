import z from "zod";

export const updateStudentImageInputSchema = z.object({
  imageUrl: z.union([z.url("Invalid image URL"), z.literal("")]).optional(),
});

export type UpdateStudentImageInput = z.infer<
  typeof updateStudentImageInputSchema
>;

export const updateStudentImageResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type UpdateStudentImageResponse = z.infer<
  typeof updateStudentImageResponseSchema
>;
