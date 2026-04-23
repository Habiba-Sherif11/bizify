import { useMutation } from "@tanstack/react-query";

// Placeholder hooks to pass Vercel build
export function useForgotPassword() {
  return useMutation({ mutationFn: async () => { throw new Error("Not implemented"); } });
}

export function useResetPassword() {
  return useMutation({ mutationFn: async () => { throw new Error("Not implemented"); } });
}