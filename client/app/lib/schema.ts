import { ProjectStatus } from '@/types';
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


export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "Due date is required"),
  members: z.array(z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    ).optional(),
  tags: z.string().optional(),
});