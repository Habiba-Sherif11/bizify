import { z } from "zod";

// Placeholder schema to pass Vercel build
export const resetPasswordSchema = z.object({}).loose();
export type ResetPasswordFormValues = Record<string, any>;