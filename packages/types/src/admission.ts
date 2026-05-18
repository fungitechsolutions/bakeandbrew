import z from "zod";

const studentAdmissionResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    referenceNo: z.string(),
    fiscalYear: z.string(),
    createdAt: z.string(),
  }),
});

export type StudentAdmissionResponse = z.infer<
  typeof studentAdmissionResponseSchema
>;
