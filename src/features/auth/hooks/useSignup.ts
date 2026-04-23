import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setTempCredentials } from "@/features/auth/store/authSlice";
import { toast } from "react-toastify";
import { parseAuthError } from "@/features/auth/utils/parseAuthError";
import { SignupPayload } from "@/features/auth/types/auth.types";

export const useSignup = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: SignupPayload) => apiClient.post("/api/v1/users/register", data),
    onSuccess: (_, variables) => {
      toast.success("Account created! Check your email.");
      dispatch(setTempCredentials({ password: variables.password }));
    },
    onError: (error) => toast.error(parseAuthError(error)),
  });
};