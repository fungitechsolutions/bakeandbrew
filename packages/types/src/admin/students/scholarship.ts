import z from "zod";
import { errorResponse } from "../../base";

const studentScholarshipSchema = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
  addedBy: z.string(),
  percent: z.number(),
  note: z.string().optional(),
  amount: z.number(),
  createdAt: z.date(),
  addedByName: z.string(),
});

const getStudentScholarshipResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: studentScholarshipSchema,
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
    code: z.string(),
  }),
]);

export type GetStudentScholarshipResponse = z.infer<
  typeof getStudentScholarshipResponse
>;

export const studentScholarshipMutationSchema = z.object({
  percent: z.number().gt(0).lte(100),
  note: z.string().trim().min(1).max(100).optional(),
});

export type StudentScholarshipInput = z.infer<
  typeof studentScholarshipMutationSchema
>;

const studentScholarshipResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type StudentScholarshipMutationResponse = z.infer<
  typeof studentScholarshipResponseSchema
>;
