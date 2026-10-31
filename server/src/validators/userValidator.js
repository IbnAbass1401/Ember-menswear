import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters)").max(60, "Name is too long"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(72, "New password is too long"),
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });