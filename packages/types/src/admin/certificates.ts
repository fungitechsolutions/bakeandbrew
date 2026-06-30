import z from "zod";

export const certificateTypeSchema = z.enum(["normal", "workshop"]);

export const issueCertificateInputSchema = z.object({
  remarks: z.string().min(1, "Remarks are required"),
  type: certificateTypeSchema.optional(),
});

export type IssueCertificateInput = z.infer<typeof issueCertificateInputSchema>;

export const certificateRecordSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  issuedBy: z.string(),
  issuedAt: z.string(),
  remarks: z.string().nullable().optional(),
  type: certificateTypeSchema,
});

export type CertificateRecord = z.infer<typeof certificateRecordSchema>;

export const issueCertificateResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: certificateRecordSchema,
});

export type IssueCertificateResponse = z.infer<
  typeof issueCertificateResponseSchema
>;

export const studentCertificateSchema = z.object({
  id: z.string(),
  type: certificateTypeSchema,
  remarks: z.string().nullable().optional(),
  issuedAt: z.string().nullable().optional(),
});

export type StudentCertificate = z.infer<typeof studentCertificateSchema>;

export const getStudentCertificateResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: studentCertificateSchema,
});

export type GetStudentCertificateResponse = z.infer<
  typeof getStudentCertificateResponseSchema
>;
