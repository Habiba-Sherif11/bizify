"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { otpSchema, OtpFormValues } from "../schema/otpSchema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";

function OtpContent() {
  const searchParams = useSearchParams();
  // ✅ Normalize email from URL params
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  
  const { handleSubmit, register, formState: { errors } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: "" }
  });

  const { mutate: verify, isPending } = useVerifyOtp();

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-light text-gray-900 mb-4">Verify Email</h1>
      <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-5">
        <form onSubmit={handleSubmit((data) => verify({ email, ...data }))} className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">We sent a code to <strong>{email}</strong>.</p>
          <div className="space-y-1">
            <Label className="text-xs text-gray-500">Code</Label>
            <input
              {...register("otp_code")}
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
              aria-invalid={!!errors.otp_code}
            />
            {errors.otp_code && <p className="text-[11px] text-red-500">{errors.otp_code.message}</p>}
          </div>
          <Button type="submit" disabled={isPending} variant={"primary-gradient"}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function VerifyOtpPage() {
  return <Suspense fallback={<div>Loading...</div>}><OtpContent /></Suspense>;
}