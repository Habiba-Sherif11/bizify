"use client";

import { useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { Step1Signup } from "./auth-onboarding-steps/Step1Signup";
import { Step2Verify } from "./auth-onboarding-steps/Step2Verify";
import { Step3About } from "./auth-onboarding-steps/Step3About";
import { SuccessStep } from "./SuccessStep"; 
import { cn } from "@/lib/utils";
import { UserRole } from "@/features/auth/types/auth.types";

const STEPS = [
  { number: 1, label: "Start" },
  { number: 2, label: "Verify" },
  { number: 3, label: "About You" },
  { number: 4, label: "Finish" }, 
];

export function AuthOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("entrepreneur");
  const [userFullName, setUserFullName] = useState(""); 
  const [skippedQuestionnaire, setSkippedQuestionnaire] = useState(false); 

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 w-full">
        {currentStep === 0 && "Create your Bizify account"}
        {currentStep === 1 && "Verify your email"}
        {currentStep === 2 && "Tell us about yourself"}
        {currentStep === 3 && "All done!"} 
      </h1>

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
                    isActive ? "bg-amber-500 text-white" : isPast ? "bg-cyan-500 text-white" : "bg-neutral-300 text-white"
                  )}
                >
                  {isPast ? "✓" : step.number}
                </div>
                <span className={cn("text-[11px] font-light whitespace-nowrap transition-colors", isActive ? "text-amber-500" : isPast ? "text-cyan-500" : "text-neutral-300")}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 flex items-center pt-[9px] px-2 sm:px-4">
                  <div className={cn("w-full h-0.5", isPast ? "bg-cyan-500" : "bg-neutral-300")} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 min-h-[300px]">
        {currentStep === 0 && (() => {
          const Step1SignupWithOnNext = Step1Signup as ComponentType<{ 
            onNext: (email: string, password: string, role: UserRole, fullName: string) => void 
          }>;
          return (
            <Step1SignupWithOnNext
              onNext={(email, password, role, fullName) => { 
                setUserEmail(email.trim().toLowerCase());
                setSelectedRole(role); 
                setUserFullName(fullName); 
                setCurrentStep(1);
              }}
            />
          );
        })()}
        
        {currentStep === 1 && (
          <Step2Verify
            email={userEmail}
            onNext={() => {
              if (selectedRole !== "entrepreneur") {
                router.push("/other-roles");
                return;
              }
              setCurrentStep(2);
            }}
          />
        )}
        
        {currentStep === 2 && (
          <Step3About 
            onFinish={(skipped) => { 
              setSkippedQuestionnaire(skipped);
              setCurrentStep(3);
            }}
            userName={userFullName} 
          />
        )}

        {currentStep === 3 && (
          <div className="py-10 flex flex-col items-center justify-center gap-4">
             <SuccessStep />
             {skippedQuestionnaire && (
               <p className="text-sm text-gray-500 text-center -mt-4">
                 You skipped the onboarding questionnaire. You can complete it later from your dashboard settings.
               </p>
             )}
             <a href="/login" className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors mt-2">
               Proceed to Login →
             </a>
          </div>
        )}
      </div>
    </div>
  );
}