import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"), 
  password: z.string().min(6, "Password required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password required"),
    });

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
});

const emailSchema = z.object({
    email: z.string().email("Invalid email address")
});

export {registerSchema,  loginSchema, verifyEmailSchema, resetPasswordSchema, emailSchema};
