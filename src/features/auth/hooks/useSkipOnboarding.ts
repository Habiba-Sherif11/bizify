import { useMutation } from "@tanstack/react-query";
import { skipOnboarding } from "../services/authService";

export function useSkipOnboarding() {
  return useMutation({
    mutationFn: (token: string) => skipOnboarding(token),
    onError: (error: Error) => {
      console.error("Skip failed:", error.message);
      alert("Could not skip right now. Please try again.");
    },
  });
}