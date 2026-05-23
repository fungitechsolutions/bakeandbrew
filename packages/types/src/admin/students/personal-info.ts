import z from "zod";

export const updateStudentPersonalInfoInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(5, "Full name must be at least 5 characters")
    .max(50, "Full name must be less than 70 characters")
    .regex(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^(98|97)\d{8}$/, "Enter a valid Nepali phone number"),

  source: z.enum(["facebook", "instagram", "tiktok", "referral", "inperson"], {
    error: "Please select how you heard about us",
  }),
  dobAd: z
    .string()
    .trim()
    .min(1, "Date of birth is required")

    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use format YYYY-MM-DD"),
  dobBs: z
    .string()
    .trim()
    .min(1, "Date of birth is required")

    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use format YYYY-MM-DD"),

  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(5, "Address is too short"),

  shift: z.enum(["morning", "day", "evening"]),
  shiftTime: z.string().trim().min(1, "Shift time is required"),
  batch: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().min(2).max(100).optional(),
  ),
  //   photoUrl: z.url("Invalid photo URL").nullable(),
});

export type UpdateStudentPersonalInfo = z.infer<
  typeof updateStudentPersonalInfoInputSchema
>;

export const updateStudentGuardianInfoInputSchema = z.object({
  guardianName: z
    .string()
    .trim()
    .min(1, "Guardian name is required")
    .min(5, "Guardian name must be at least 5 characters")
    .max(70, "Guardian name must be less than 70 characters")
    .regex(/^[A-Za-z ]+$/, "Guardian name can only contain letters and spaces"),

  guardianPhone: z
    .string()
    .trim()
    .min(1, "Guardian phone number is required")
    .regex(/^(98|97)\d{8}$/, "Enter a valid Nepali phone number"),
});

export type UpdateStudentGuardianInfoInput = z.infer<
  typeof updateStudentGuardianInfoInputSchema
>;

export const updateStudentInfoResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type UpdateStudentInfoResponse = z.infer<
  typeof updateStudentInfoResponseSchema
>;
