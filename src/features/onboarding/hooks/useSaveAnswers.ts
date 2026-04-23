import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { tokenManager } from "@/features/auth/utils/tokenManager"; 
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";

export function useSaveAnswers() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (answers: any[]) => {
      const token = tokenManager.get(); // ✅ correct
      if (!token) throw new Error("No authentication token");

      const response = await apiClient.post("/api/v1/onboarding/answers", { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Onboarding completed!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = parseAuthError(error);
      toast.error(message);
    },
  });
}