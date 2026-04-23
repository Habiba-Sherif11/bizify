import { useMutation } from "@tanstack/react-query";
import { submitQuestionnaire } from "../services/authService";

export function useSubmitQuestionnaire() {
  return useMutation({
    mutationFn: ({ token, answers }: { token: string; answers: any[] }) => {
      return submitQuestionnaire(token, answers);
    },
    onError: (error: Error) => {
      console.error("Questionnaire submission failed:", error.message);
      alert(error.message || "Something went wrong while saving.");
    },
  });
}