import z from "zod";

export const updateProfileInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),
  imageUrl: z.union([z.url("Invalid image URL"), z.literal("")]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

const profileUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  imageUrl: z.string().nullable().optional(),
  role: z.enum(["admin", "student", "superadmin"]),
  createdAt: z.string(),
});

export const updateProfileResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: profileUserSchema,
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;

const updatePasswordFieldsSchema = z.object({
  current_password: z
    .string()
    .min(1, "Enter your current password")
    .min(8, "Password must be at least 8 characters"),
  new_password: z
    .string()
    .min(1, "Enter a new password")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your new password"),
});

export const updatePasswordFormSchema = updatePasswordFieldsSchema.superRefine(
  (data, ctx) => {
    if (data.new_password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (
      data.current_password &&
      data.new_password &&
      data.current_password === data.new_password
    ) {
      ctx.addIssue({
        code: "custom",
        message: "New password must be different from your current password",
        path: ["new_password"],
      });
    }
  },
);

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormSchema>;

export const updatePasswordInputSchema = updatePasswordFieldsSchema.pick({
  current_password: true,
  new_password: true,
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

export const updatePasswordResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type UpdatePasswordResponse = z.infer<typeof updatePasswordResponseSchema>;
