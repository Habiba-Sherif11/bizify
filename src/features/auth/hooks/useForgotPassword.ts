import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { authService } from "@/features/auth/services/authService";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => {
      console.log("📧 useForgotPassword: Requesting reset for", email);
      return authService.forgotPassword(email);
    },

    onSuccess: () => {
      console.log("✅ useForgotPassword: Reset code sent");
      toast.success("Reset code sent to your email!");
    },

    onError: (error) => {
      console.error("❌ useForgotPassword: Error", error);
      toast.error(parseAuthError(error));
    },
  });
};