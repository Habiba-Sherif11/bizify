import { apiClient } from "@/lib/api";
import { SignupPayload, AuthTokenResponse } from "@/features/auth/types/auth.types";

// ✅ Helper function for email normalization
const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const authService = {
  async register(payload: SignupPayload) {
    const normalizedPayload = {
      ...payload,
      email: normalizeEmail(payload.email),
    };
    console.log("📝 authService.register called", { email: normalizedPayload.email });
    // ✅ Remove '/api/v1' prefix – baseURL already includes it
    const response = await apiClient.post("/users/register", normalizedPayload);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    console.log("🔐 authService.login called", { email });
    const response = await apiClient.post(
      "/auth/login",
      new URLSearchParams({
        username: normalizeEmail(email),
        password: password,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    console.log("✅ authService.login successful");
    return response.data;
  },

  async verifyOtpAndLogin(
    email: string,
    otpCode: string,
    password: string
  ): Promise<AuthTokenResponse> {
    const normalizedEmail = normalizeEmail(email);
    const normalizedOtp = String(otpCode).trim();

    console.log("🔍 authService.verifyOtpAndLogin called", {
      email: normalizedEmail,
      otpCode: normalizedOtp.substring(0, 2) + "***",
    });

    try {
      // Step 1: Verify OTP
      console.log("📤 authService: Calling verify-otp...");
      await apiClient.post("/auth/verify-otp", {
        email: normalizedEmail,
        otp_code: normalizedOtp,
      });
      console.log("✅ authService: OTP verified");

      // Step 2: Auto-login with credentials
      console.log("📤 authService: Calling login...");
      const loginResponse = await apiClient.post(
        "/auth/login",
        new URLSearchParams({
          username: normalizedEmail,
          password: password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      console.log("✅ authService: Login successful, got token");
      return loginResponse.data;
    } catch (error) {
      console.error("❌ authService.verifyOtpAndLogin error:", error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    console.log("📧 authService.forgotPassword called", { email: normalizeEmail(email) });
    // ✅ Use relative path – query params appended directly
    const response = await apiClient.post(
      `/auth/forgot-password?email=${encodeURIComponent(normalizeEmail(email))}`
    );
    console.log("✅ authService.forgotPassword: Reset code sent");
    return response.data;
  },

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    console.log("🔄 authService.resetPassword called", { email: normalizeEmail(email) });
    const response = await apiClient.post(
      `/auth/reset-password?email=${encodeURIComponent(normalizeEmail(email))}&otp_code=${encodeURIComponent(String(otpCode).trim())}&new_password=${encodeURIComponent(newPassword)}`
    );
    console.log("✅ authService.resetPassword: Password reset successful");
    return response.data;
  },

  async logout() {
    console.log("🚪 authService.logout called");
    const response = await apiClient.post("/auth/logout");
    console.log("✅ authService.logout: Logged out");
    return response.data;
  },

  async resendOtp(email: string) {
    const normalizedEmail = normalizeEmail(email);
    console.log("📧 authService.resendOtp called", { email: normalizedEmail });
    const response = await apiClient.post("/auth/resend-verification-otp", { email: normalizedEmail });
    console.log("✅ authService.resendOtp: OTP resent");
    return response.data;
  },
};

// ✅ These functions use relative fetch – they will also work because they start with "/api/v1/..."
export const forgotPassword = async (email: string) => {
  const response = await fetch("/api/v1/users/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to send reset link" }));
    throw new Error(errorData.message || "Failed to send reset link");
  }
  return response.json();
};

export const resetPassword = async ({ token, password, confirm_password }: { token: string; password: string; confirm_password: string }) => {
  const response = await fetch("/api/v1/users/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password, confirm_password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to reset password" }));
    throw new Error(errorData.message || "Failed to reset password");
  }
  return response.json();
};

export const submitQuestionnaire = async (token: string, answers: any[]) => {
  // ✅ Use relative path – token is passed, but baseURL already includes /api/v1
  const response = await apiClient.post("/profile/questionnaire", answers, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const skipOnboarding = async (token: string) => {
  const response = await apiClient.post("/profile/skip", null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};