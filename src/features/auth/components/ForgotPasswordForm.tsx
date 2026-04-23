"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const isEmailErrored = emailTouched && email.length > 0 && !isValidEmail(email);
  const isFormReady = isValidEmail(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormReady) return;

    sendResetLink(email.trim().toLowerCase(), {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        alert(error.message || "Something went wrong.");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-200/50">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <Mail className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
            <p className="text-sm text-gray-500 mt-1">
              We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>
          <Link href="/login" className="text-sm font-medium text-cyan-600 hover:text-cyan-700 mt-2">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-200/50">
      <div className="mb-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
          <ArrowLeft size={14} />
          Back to login
        </Link>
        <h2 className="text-2xl font-light text-gray-900">Forgot password?</h2>
        <p className="text-sm text-gray-500 mt-1">No worries, we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(
              "h-11 text-sm transition-colors",
              isEmailErrored && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15",
              !isEmailErrored && "border-gray-300"
            )}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email.length > 0) setEmailTouched(true);
            }}
            disabled={isPending}
          />
          {isEmailErrored && (
            <p className="text-[11px] text-red-500 pt-1">Please enter a valid email address</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending || !isFormReady}
          variant={"primary-gradient"}
          className="w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}