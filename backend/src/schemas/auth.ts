import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128).refine(
    (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
    "Password must contain at least one letter and one number.",
  ),
});

export const LoginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(20).max(4096),
});
