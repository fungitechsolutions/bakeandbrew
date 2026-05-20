import z from "zod";

export const getStudentOverviewResponseSchema = z.discriminatedUnion(
  "success",
  [
    z.object({
      success: z.literal(true),
      data: z.object({
        id: z.uuid(),
        fullName: z.string(),
        referenceNo: z.string(),
        batch: z.string().optional(),
        createdAt: z.string(),
        phone: z.string(),
        shift: z.enum(["morning", "day", "evening"]),
        shiftTime: z.string(),
        gender: z.enum(["male", "female", "other"]),
        guardianName: z.string(),
        guardianPhone: z.string(),
        address: z.string(),
        fiscalYear: z.string(),
        dob: z.string(),
        photoUrl: z.string().optional(),
        status: z.enum(["active", "completed"]),
      }),
    }),
    z.object({
      success: z.literal(false),
      message: z.string(),
      code: z.string(),
    }),
  ],
);

export type GetStudentOverviewResponse = z.infer<
  typeof getStudentOverviewResponseSchema
>;
