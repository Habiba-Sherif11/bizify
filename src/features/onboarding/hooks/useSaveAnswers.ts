import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { getToken } from "@/features/auth/utils/tokenManager";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { QuestionnaireAnswer } from "@/features/auth/types/auth.types";

export const useSaveAnswers = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (answers: QuestionnaireAnswer[]) => {
      const token = getToken();
      await apiClient.post("/api/v1/profile/questionnaire", answers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await apiClient.post("/api/v1/profile/complete", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Setup complete!");
      router.push("/onboarding"); // Go to main app onboarding
    },
    onError: (error) => toast.error(parseAuthError(error)),
  });
};