"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/features/auth/components/PasswordStrength";
import { Eye, EyeOff, Loader2, Check, Rocket, UserCheck, Factory, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/features/auth/types/auth.types";

const PASSWORD_RULES = {
  minLength: { test: /.{8,}/ },
  uppercase: { test: /[A-Z]/ },
  lowercase: { test: /[a-z]/ },
  number: { test: /[0-9]/ },
  special: { test: /[!@#$%&*?]/ },
} as const;

function validatePassword(password: string) {
  return Object.fromEntries(
    Object.entries(PASSWORD_RULES).map(([key, rule]) => [
      key,
      rule.test.test(password),
    ])
  ) as Record<keyof typeof PASSWORD_RULES, boolean>;
}

function isPasswordValid(
  checks: Record<keyof typeof PASSWORD_RULES, boolean>
) {
  return Object.values(checks).every(Boolean);
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function SignupForm({
  onNext,
}: {
  onNext: (email: string, password: string, role: UserRole) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordChecks = validatePassword(password);
  const passwordValid = isPasswordValid(passwordChecks);

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const isEmailErrored =
    emailTouched && email.length > 0 && !isValidEmail(email);
  const isEmailSuccess =
    emailTouched && email.length > 0 && isValidEmail(email);

  const isPasswordErrored =
    passwordTouched && password.length > 0 && !passwordValid;
  const isPasswordSuccess =
    passwordTouched && password.length > 0 && passwordValid;

  const isConfirmErrored =
    confirmTouched && confirmPassword.length > 0 && !passwordsMatch;
  const isConfirmSuccess =
    confirmTouched && confirmPassword.length > 0 && passwordsMatch;

  const isFormReady =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    isValidEmail(email) &&
    passwordValid &&
    passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      console.log("📝 Registering user:", { email, fullName });

      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          full_name: fullName,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      if (!response.ok) {
        let message = "Failed to create account";
        try {
          const data = (await response.json()) as {
            message?: string;
            detail?: string;
          };
          message = data.message || data.detail || message;
        } catch {}
        throw new Error(message);
      }

      console.log("✅ User registered successfully");
      onNext(email, password, role);
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      alert(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Name row */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Name</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="First Name"
            autoComplete="given-name"
            className="h-9 text-sm border-gray-300"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder="Last Name"
            autoComplete="family-name"
            className="h-9 text-sm border-gray-300"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={cn(
            "h-9 text-sm transition-colors",
            isEmailErrored &&
              "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15",
            isEmailSuccess &&
              "border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15",
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
          <p className="text-[11px] text-red-500">
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            className={cn(
              "h-9 pr-9 text-sm transition-colors",
              isPasswordErrored &&
                "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15",
              isPasswordSuccess &&
                "border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15",
              !isPasswordErrored && !isPasswordSuccess && "border-gray-300"
            )}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => {
              setIsPasswordFocused(false);
              if (password.length > 0) setPasswordTouched(true);
            }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <PasswordStrength
          password={password}
          focused={isPasswordFocused || passwordTouched}
          touched={passwordTouched}
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Confirm Password</Label>
        <div className="relative">
          <Input
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className={cn(
              "h-9 pr-9 text-sm transition-colors",
              isConfirmErrored &&
                "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/15",
              isConfirmSuccess &&
                "border-cyan-500 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/15",
              !isConfirmErrored && !isConfirmSuccess && "border-gray-300"
            )}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => {
              if (confirmPassword.length > 0) setConfirmTouched(true);
            }}
            disabled={isLoading}
          />
          {isConfirmSuccess && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-500">
              <Check size={14} strokeWidth={2.5} />
            </div>
          )}
        </div>
        {isConfirmErrored && (
          <p className="text-[11px] text-red-500">Passwords do not match</p>
        )}
      </div>

      {/* ✅ ROLE SELECTOR CARDS */}
      <div className="space-y-2 pt-2">
        <Label className="text-xs text-gray-500">I am a...</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          {/* Entrepreneur Card */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setRole("entrepreneur")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
              role === "entrepreneur" 
                ? "border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500/20" 
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <Rocket className={cn("w-5 h-5 mt-0.5 shrink-0", role === "entrepreneur" ? "text-cyan-600" : "text-gray-400")} />
            <div>
              <p className={cn("text-sm font-medium", role === "entrepreneur" ? "text-cyan-700" : "text-gray-800")}>Entrepreneur</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">"I'm building a business – from idea to launch."</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-1 hidden sm:block">Validate concepts, research markets, and build your plan.</p>
            </div>
          </button>

          {/* Mentor Card */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setRole("mentor")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
              role === "mentor" 
                ? "border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500/20" 
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <UserCheck className={cn("w-5 h-5 mt-0.5 shrink-0", role === "mentor" ? "text-cyan-600" : "text-gray-400")} />
            <div>
              <p className={cn("text-sm font-medium", role === "mentor" ? "text-cyan-700" : "text-gray-800")}>Mentor</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">"I guide founders and share my expertise."</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-1 hidden sm:block">Review plans, provide feedback, and support founders.</p>
            </div>
          </button>

          {/* Manufacturer Card */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setRole("manufacturer")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
              role === "manufacturer" 
                ? "border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500/20" 
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <Factory className={cn("w-5 h-5 mt-0.5 shrink-0", role === "manufacturer" ? "text-cyan-600" : "text-gray-400")} />
            <div>
              <p className={cn("text-sm font-medium", role === "manufacturer" ? "text-cyan-700" : "text-gray-800")}>Manufacturer</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">"I produce goods and manage production."</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-1 hidden sm:block">Showcase capabilities and connect with businesses.</p>
            </div>
          </button>

          {/* Supplier Card */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setRole("supplier")}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
              role === "supplier" 
                ? "border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500/20" 
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <Package className={cn("w-5 h-5 mt-0.5 shrink-0", role === "supplier" ? "text-cyan-600" : "text-gray-400")} />
            <div>
              <p className={cn("text-sm font-medium", role === "supplier" ? "text-cyan-700" : "text-gray-800")}>Supplier</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">"I provide materials and products."</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-1 hidden sm:block">List your catalog and fulfill B2B orders efficiently.</p>
            </div>
          </button>

        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !isFormReady}
        variant={"primary-gradient"}
        className="disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}