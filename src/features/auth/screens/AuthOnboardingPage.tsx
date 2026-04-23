import { AuthOnboardingForm } from "../components/AuthOnboardingForm";
import Link from "next/link";

export function AuthOnboardingPage() {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <AuthOnboardingForm />
      <p className="text-center text-xs text-gray-500 mt-3">
        Already have an account? <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">Sign in</Link>
      </p>
    </div>
  );
}