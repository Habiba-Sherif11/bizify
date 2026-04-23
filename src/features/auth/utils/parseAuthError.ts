import { AxiosError } from "axios";

export const parseAuthError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) return detail[0].msg;
    return detail;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};