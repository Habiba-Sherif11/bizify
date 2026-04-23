import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { authService } from "@/features/auth/services/authService";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string; code: string; password: string }) => {
      console.log("🔄 useResetPassword: Resetting password for", data.email);
      return authService.resetPassword(data.email, data.code, data.password);
    },

    onSuccess: () => {
      console.log("✅ useResetPassword: Password reset successfully");
      toast.success("Password reset successfully! Please log in.");
    },

    onError: (error) => {
      console.error("❌ useResetPassword: Error", error);
      toast.error(parseAuthError(error));
    },
  });
};