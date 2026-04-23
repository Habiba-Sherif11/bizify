import { z } from "zod";

export const otpSchema = z.object({
  otp_code: z.string().length(6, "Must be exactly 6 digits"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;