import z from "zod";

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const baseResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const errorResponse = z.object({
  code: z.string(),
  message: z.string(),
  field: z.string(),
});

export const loginResponse = baseResponse.extend({
  errors: z.array(errorResponse).optional(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type LoginResponse = z.infer<typeof loginResponse>;
