"use client";

import { QuestionnaireForm } from "../QuestionnaireForm";

export function Step3About({ onFinish, userName }: { onFinish: (skipped: boolean) => void; userName?: string }) {
  return (
    <QuestionnaireForm 
      onFinish={onFinish}
      userName={userName || "User"} 
      userAvatar="/assets/imgs/onboarding/my-photo.png"
      aiAvatar="/assets/imgs/onboarding/bizify-logo.png"
    />
  );
}