import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/features/auth/store/authSlice";

import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { authService } from "@/features/auth/services/authService";
import { AuthTokenResponse } from "@/features/auth/types/auth.types";
import { tokenManager } from "@/features/auth/utils/tokenManager";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),

    onSuccess: (data: AuthTokenResponse) => {
      dispatch(setAccessToken(data.access_token));
      tokenManager.set(data.access_token);
      toast.success("Logged in successfully!");
    },

    onError: (error) => {
      toast.error(parseAuthError(error));
    },
  });
};