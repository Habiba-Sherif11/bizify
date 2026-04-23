"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { otpSchema, OtpFormValues } from "@/features/auth/schema/otpSchema";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import { useSelector } from "react-redux";
import { useState } from "react";
import { authService } from "@/features/auth/services/authService"; // ✅ Import authService

export function Step2Verify({
  email,
  onNext,
  onBack,
}: {
  email: string;
  onNext: (token: string) => void;
  onBack?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const { mutate: verify, isPending, error } = useVerifyOtp();
  const tempPassword = useSelector((state: any) => state.auth.tempSignupPassword);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // 🔍 DEBUG: Check if session exists
  console.log("🔍 Step2Verify Debug:", {
    email,
    tempPasswordExists: !!tempPassword,
    isSubmitting,
    isPending,
    error: error?.message,
  });

  const onSubmit = async (data: OtpFormValues) => {
    console.log("📤 Submitting OTP:", { email, otp_code: data.otp_code });

    // ✅ Verify session before submitting
    if (!tempPassword) {
      console.error("❌ Session expired - no tempPassword in Redux");
      alert("Session expired. Please sign up again.");
      return;
    }

    verify(
      { email, otp_code: data.otp_code },
      {
        onSuccess: (response: any) => {
          console.log("✅ OTP verified successfully!", response);
          const token = response.access_token;
          if (!token) {
            console.error("❌ No token in response:", response);
            return;
          }
          console.log("🔐 Passing token to parent:", token.substring(0, 20) + "...");
          onNext(token);
        },
        onError: (err: any) => {
          console.error("❌ OTP verification failed:", err);
        },
      }
    );
  };

  // ✅ UPDATED handleResendOtp using authService (normalizes email)
  const handleResendOtp = async () => {
    console.log("📧 Resending OTP to:", email);
    setResendError(null);
    setResendSuccess(false);
    setResendLoading(true);
    setResendCooldown(60);

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // ✅ Use authService which now normalizes email
      await authService.resendOtp(email);

      console.log("✅ Resend successful");
      setResendSuccess(true);
      setResendError(null);

      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      console.error("❌ Resend failed:", err);
      const errorMsg = err.response?.data?.detail || err.message || "Failed to resend code";
      setResendError(errorMsg);
      setResendCooldown(0);
      clearInterval(timer);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* ⚠️ DEBUG: Show if session is missing */}
      {!tempPassword && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-semibold">Session Issue</p>
            <p>Your session expired. Please start signup again.</p>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 text-center">
        We sent a 6-digit code to <strong>{email}</strong>. Please enter it
        below.
      </p>

      <div className="space-y-1">
        <Label className="text-xs text-gray-500 text-center block">
          Verification Code
        </Label>
        <Input
          type="text"
          placeholder="123456"
          className="h-9 text-sm text-center tracking-widest border-gray-300"
          {...register("otp_code", {
            onChange: (e) =>
              (e.target.value = e.target.value.replace(/[^0-9]/g, "")),
          })}
          disabled={isSubmitting || isPending || !tempPassword}
          maxLength={6}
        />
        {errors.otp_code && (
          <p className="text-[11px] text-red-500 text-center">
            {errors.otp_code.message}
          </p>
        )}
      </div>

      {/* ⚠️ Display any API errors with helpful debugging */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 flex-1">
            <p className="font-semibold">Verification Failed</p>
            <p className="mt-1">{error.message}</p>

            {/* Debug info for backend team */}
            <details className="mt-2 text-xs opacity-70 cursor-pointer">
              <summary>Debug Info (share with support)</summary>
              <pre className="mt-1 bg-white p-2 rounded overflow-auto max-h-24">
{JSON.stringify({
  email,
  error: error.message,
  timestamp: new Date().toISOString(),
}, null, 2)}
              </pre>
            </details>

            {/* Helpful suggestions */}
            <div className="mt-2 space-y-1 text-xs">
              <p>💡 <strong>Try these steps:</strong></p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Check spam/junk folder for the OTP email</li>
                <li>Wait 1-2 minutes and try again</li>
                <li>Click "Resend" to request a new code</li>
                <li>Go back and use a different email address</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Resend success message */}
      {resendSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Code sent successfully!</p>
        </div>
      )}

      {/* ❌ Resend error message */}
      {resendError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{resendError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || isPending || !tempPassword}
        variant={"primary-gradient"}
        className="disabled:opacity-50 w-full"
      >
        {isSubmitting || isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Verifying...
          </>
        ) : (
          "Verify & Continue"
        )}
      </Button>

      <button
        type="button"
        onClick={handleResendOtp}
        disabled={resendCooldown > 0 || resendLoading}
        className="text-xs text-cyan-600 hover:text-cyan-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {resendLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
            Sending...
          </>
        ) : resendCooldown > 0 ? (
          `Resend in ${resendCooldown}s`
        ) : (
          "Didn't receive code? Resend"
        )}
      </button>

      {/* Back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to signup
        </button>
      )}
    </form>
  );
}