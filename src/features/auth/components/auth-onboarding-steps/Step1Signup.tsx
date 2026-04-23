"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "../PasswordStrength";
import { Loader2, Check, Rocket, UserCheck, Factory, Package } from "lucide-react";
import { signupSchema, SignupFormValues } from "../../schema/signupSchema";
import { useSignup } from "../../hooks/useSignup";
import { UserRole } from "../../types/auth.types";
import { signupStorage } from "@/features/auth/utils/signupStorage";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ✅ CHANGE 1: Updated props to accept email, password, and role
interface Step1SignupProps {
  onNext?: (email: string, password: string, role: UserRole, fullName: string) => void;
}

export function Step1Signup({ onNext }: Step1SignupProps) {
  // ✅ CHANGE 2: Added role state
  const [role, setRole] = useState<UserRole>("entrepreneur");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const { mutate: signup } = useSignup();
  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const onSubmit = (data: SignupFormValues) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    console.log("📧 Step1Signup - Normalizing email:", {
      original: data.email,
      normalized: normalizedEmail,
    });

      const payload = {
      email: normalizedEmail,
      full_name: `${data.firstName} ${data.lastName}`,
      password: data.password,
      confirm_password: data.confirm_password,
      role: role.toUpperCase(), // ✅ SENDS "ENTREPRENEUR", "MENTOR", ETC. TO BACKEND
    };

          signup(payload, {
        onSuccess: () => {
          // ✅ SAVE TO SESSION STORAGE FOR QUESTIONNAIRE
          signupStorage.setSignupContext(normalizedEmail, data.password);

          // ✅ PASS FULL NAME
          if (onNext) {
            onNext(normalizedEmail, data.password, role, `${data.firstName} ${data.lastName}`);
          }
        },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Name</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="First Name"
            className={cn("h-9 text-sm", errors.firstName && "border-red-400")}
            {...register("firstName")}
            disabled={isSubmitting}
          />
          <Input
            placeholder="Last Name"
            className={cn("h-9 text-sm", errors.lastName && "border-red-400")}
            {...register("lastName")}
            disabled={isSubmitting}
          />
        </div>
        {errors.firstName && (
          <p className="text-[11px] text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          className={cn("h-9 text-sm", errors.email && "border-red-400")}
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-[11px] text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Password</Label>
        <Input
          type="password"
          placeholder="Create a password"
          className={cn("h-9 text-sm", errors.password && "border-red-400")}
          {...register("password")}
          disabled={isSubmitting}
        />
        <PasswordStrength
          password={password}
          focused={true}
          touched={!!errors.password}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Confirm Password</Label>
        <div className="relative">
          <Input
            type="password"
            placeholder="Re-enter"
            className={cn(
              "h-9 pr-9 text-sm",
              errors.confirm_password
                ? "border-red-400"
                : passwordsMatch
                ? "border-cyan-500"
                : "border-gray-300"
            )}
            {...register("confirm_password")}
            disabled={isSubmitting}
          />
          {passwordsMatch && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-500">
              <Check size={14} strokeWidth={2.5} />
            </div>
          )}
        </div>
        {errors.confirm_password && (
          <p className="text-[11px] text-red-500">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* ✅ CHANGE 4: Added Role Selector Cards */}
      <div className="space-y-2 pt-2">
        <Label className="text-xs text-gray-500">I am a...</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          <button
            type="button"
            disabled={isSubmitting}
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

          <button
            type="button"
            disabled={isSubmitting}
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

          <button
            type="button"
            disabled={isSubmitting}
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

          <button
            type="button"
            disabled={isSubmitting}
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

      <Button
        type="submit"
        disabled={isSubmitting}
        variant={"primary-gradient"}
        className="disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}