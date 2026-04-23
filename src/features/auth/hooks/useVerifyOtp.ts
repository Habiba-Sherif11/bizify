import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "@/features/auth/store/authSlice";
import { tokenManager } from "@/features/auth/utils/tokenManager";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { authService } from "@/features/auth/services/authService";

export const useVerifyOtp = () => {
  const dispatch = useDispatch();
  const tempPassword = useSelector((state: any) => state.auth.tempSignupPassword);

  return useMutation({
    mutationFn: async (data: { email: string; otp_code: string }) => {
      // ✅ NORMALIZE EMAIL
      const normalizedEmail = data.email.trim().toLowerCase();
      const normalizedOtp = String(data.otp_code).trim();

      console.log("🔄 useVerifyOtp: Starting verification", { 
        originalEmail: data.email, 
        normalizedEmail,
        otp: normalizedOtp 
      });

      if (!tempPassword) {
        console.error("❌ useVerifyOtp: No tempPassword in Redux");
        throw new Error("Session expired. Please sign up again.");
      }

      // ✅ FIX: Call only ONCE and capture the response
      const response = await authService.verifyOtpAndLogin(
        normalizedEmail,
        normalizedOtp,
        tempPassword
      );

      console.log("✅ useVerifyOtp: Got token", {
        tokenLength: response.access_token?.length,
      });

      return response;
    },

    onSuccess: (data) => {
      console.log("✅ useVerifyOtp onSuccess: Storing token");

      dispatch(setAccessToken(data.access_token));
      tokenManager.set(data.access_token);

      toast.success("Email verified! Welcome to Bizify");
    },

    onError: (error) => {
      console.error("❌ useVerifyOtp onError:", error);
      const message = parseAuthError(error);
      toast.error(message);
    },
  });
};