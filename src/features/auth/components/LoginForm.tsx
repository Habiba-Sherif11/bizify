"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/features/auth/hooks/useLogin";

// Basic email regex
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ USE THE LOGIN HOOK
  const { mutate: login, isPending } = useLogin();
  
  // Touch states to lock errors after unfocus
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Error/Success states for UI
  const isEmailErrored = emailTouched && email.length > 0 && !isValidEmail(email);
  const isEmailSuccess = emailTouched && email.length > 0 && isValidEmail(email);

  const isPasswordErrored = passwordTouched && password.length === 0;
  const isPasswordSuccess = passwordTouched && password.length > 0;

  // STRICT CHECK: Button is ONLY active if email is valid and password is not empty
  const isFormReady = isValidEmail(email) && password.length > 0;

  // ✅ REAL SUBMIT HANDLER THAT CALLS THE API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark both fields as touched to show errors
    setEmailTouched(true);
    setPasswordTouched(true);
    
    if (!isFormReady) return;
    
    // ✅ ACTUALLY CALL THE LOGIN MUTATION
    login(
      { 
        email: email.trim().toLowerCase(), 
        password 
      },
      {
        onSuccess: (data) => {
          // ✅ Get the role from the backend response
         const role = (data?.role || data?.user?.role || "").toUpperCase();
          
          // ✅ Route based on the official backend role
          if (role === "ADMIN") {
            router.push("/admin");
          } else if (role === "MENTOR") {
            router.push("/mentor");
          } else if (role === "MANUFACTURER") {
            router.push("/manufacturer");
          } else if (role === "SUPPLIER") {
            router.push("/supplier");
          } else {
            // Default for ENTREPRENEUR or if role is missing
            router.push("/dashboard");
          }
        },
      }
    );
  };

  // Use isPending from the mutation instead of local isLoading
  const isLoading = isPending;

  return (
    <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 shadow-xl shadow-gray-200/50">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
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
              isEmailSuccess && "border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15",
              !isEmailErrored && !isEmailSuccess && "border-gray-300"
            )}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              if (email.length > 0) setEmailTouched(true);
            }}
            disabled={isLoading}
          />
          {isEmailErrored && (
            <p className="text-[11px] text-red-500 pt-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={cn(
                "h-11 pr-10 text-sm transition-colors",
                isPasswordErrored && "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15",
                isPasswordSuccess && "border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15",
                !isPasswordErrored && !isPasswordSuccess && "border-gray-300"
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                if (password.length > 0 || passwordTouched) setPasswordTouched(true);
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {isPasswordErrored && (
            <p className="text-[11px] text-red-500 pt-1">Password is required</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading || !isFormReady}
          variant={"primary-gradient"}
          className="w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}