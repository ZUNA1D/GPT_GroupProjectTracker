import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password required")
});       


export const SignUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"), 
  password: z.string().min(6, "Password required"),
  confirmPassword: z.string().min(6, "Confirm password required")
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords don't match"
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be 6 characters"),
    confirmPassword: z.string().min(6, "Password must be 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });


export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  color: z.string().min(3, "Color must be at least 3 characters"),
  description: z.string().optional(),
});