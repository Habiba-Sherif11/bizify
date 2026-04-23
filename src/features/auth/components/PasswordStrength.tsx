"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  focused: boolean;
  touched: boolean; // New prop to handle "leave" state
}

const CHECKS = [
  { label: "Use 8 or more characters", test: (p: string) => p.length >= 8 },
  { label: "One Uppercase character", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase character", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (! @ # $ % & * ?)", test: (p: string) => /[!@#$%&*?]/.test(p) },
];

export function PasswordStrength({ password, focused, touched }: PasswordStrengthProps) {
  // Show if the input is focused OR if the user has typed something and left (touched)
  if (!focused && !touched) return null;
  // Hide completely if empty to keep the form clean before typing
  if (password.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 pt-0.5 mt-3">
      {CHECKS.map((check) => {
        const met = check.test(password);
        return (
          <div key={check.label} className="inline-flex items-center gap-2">
            <div
              className={cn(
                "w-3.5 h-3.5 rounded-full shrink-0 transition-colors",
                met ? "bg-cyan-500" : "bg-gray-300" // Cyan instead of green, Grey instead of red
              )}
            />
            <span
              className={cn(
                "text-xs font-normal transition-colors",
                met ? "text-cyan-600" : "text-gray-400" // Cyan instead of green, Grey instead of red/stone
              )}
            >
              {check.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}