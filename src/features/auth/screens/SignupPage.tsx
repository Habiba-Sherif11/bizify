"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { SignupForm } from "../components/SignupForm";
import { QuestionnaireForm } from "../components/QuestionnaireForm";
import { SuccessStep } from "../components/SuccessStep";
import { cn } from "@/lib/utils";
import { Step2Verify } from "../components/auth-onboarding-steps/Step2Verify";
import { signupStorage } from "@/features/auth/utils/signupStorage";
import { setTempCredentials } from "@/features/auth/store/authSlice";

const STEPS = [
  { number: 1, label: "Start" },
  { number: 2, label: "Verify" },
  { number: 3, label: "About You" },
];

export function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const dispatch = useDispatch();

  // ✅ On mount: Check if user was in signup flow and page refreshed
  useEffect(() => {
    const context = signupStorage.getSignupContext();
    console.log("🔍 Checking signup context on mount:", context);

    if (context) {
      // Restore state from sessionStorage
      setUserEmail(context.email);
      setCurrentStep(1); // Go back to OTP step
      // Restore tempPassword in Redux
      dispatch(setTempCredentials({ password: context.password }));
      console.log("✅ Restored signup context from sessionStorage");
    }
  }, [dispatch]);

  // Step 1: User registered successfully
  const handleSignupSuccess = (email: string, password: string) => {
    console.log("📝 Step 1: Signup successful", { email });
    
    // ✅ Persist to sessionStorage in case of refresh
    signupStorage.setSignupContext(email, password);
    
    // Store in Redux
    dispatch(setTempCredentials({ password }));
    
    setUserEmail(email);
    setCurrentStep(1); // Move to OTP verification
  };

  // Step 2: OTP verified & user logged in
  const handleOtpSuccess = (_token: string) => {
    console.log("✅ Step 2: OTP verified, token received");

    // ✅ Clear signup context - no longer needed
    signupStorage.clearSignupContext();

    setCurrentStep(2); // Move to questionnaire
  };

  // Step 2.5: Go back from OTP to signup
  const handleGoBack = () => {
    console.log("↩️ Going back to signup form");
    setCurrentStep(0); // Go back to step 0 (signup form)
  };

  // Step 3: Onboarding completed
  const handleFinish = () => {
    console.log("🎉 Step 3: Onboarding completed");
    setCurrentStep(3); // Show success
    // TODO: router.push("/dashboard")
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full mb-3">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
          Create your Bizify account
        </h1>
      </div>

      {/* Progress Stepper */}
      {currentStep < 3 && (
        <div className="w-full flex items-start justify-between mb-5">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isPast = i < currentStep;
            return (
              <div key={step.number} className="flex items-start flex-0">
                <div className="flex flex-col items-center gap-1 z-10">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors",
                      isActive
                        ? "bg-amber-500 text-white"
                        : isPast
                        ? "bg-cyan-500 text-white"
                        : "bg-neutral-300 text-white"
                    )}
                  >
                    {isPast ? "✓" : step.number}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-light whitespace-nowrap transition-colors",
                      isActive
                        ? "text-amber-500"
                        : isPast
                        ? "text-cyan-500"
                        : "text-neutral-300"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="flex-1 flex items-center pt-[9px] px-2 sm:px-4">
                    <div
                      className={cn(
                        "w-full h-0.5",
                        isPast ? "bg-cyan-500" : "bg-neutral-300"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form Card */}
      <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
        {currentStep === 0 && <SignupForm onNext={handleSignupSuccess} />}

        {currentStep === 1 && (
          <Step2Verify
            email={userEmail}
            onNext={handleOtpSuccess}
            onBack={handleGoBack}
          />
        )}

        {currentStep === 2 && (
          <QuestionnaireForm onFinish={handleFinish} />
        )}

        {currentStep === 3 && <SuccessStep />}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-3">
        Already have an account?{" "}
        <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}