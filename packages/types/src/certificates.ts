import z from "zod";
import { certificateTypeSchema } from "./admin/certificates";

export const certificateDetailsSchema = z.object({
  id: z.string(),
  type: certificateTypeSchema,
  remarks: z.string().nullable().optional(),
  issuedAt: z.string(),
  fullName: z.string(),
  referenceNo: z.string(),
  courseNames: z.string(),
});

export type CertificateDetails = z.infer<typeof certificateDetailsSchema>;

export const getCertificateDetailsResponseSchema = z.object({
  success: z.literal(true),
  data: certificateDetailsSchema,
});

export type GetCertificateDetailsResponse = z.infer<
  typeof getCertificateDetailsResponseSchema
>;
