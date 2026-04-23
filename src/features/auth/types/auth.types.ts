// src/features/auth/types/auth.types.ts

export interface SignupPayload {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
}

export interface OtpPayload {
  email: string;
  otp_code: string;
}

export interface QuestionnaireAnswer {
  field: string;
  question?: string;
  multi: boolean;
  choices: string[];
  label?: string;
}

// ✅ NEW: Add these
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface User {
  role?: string;
  [key: string]: any;
}

export interface AuthTokenResponse {
  user?: User;
  role?: string;
  access_token: string;
  token_type: string;
}

export interface AuthError {
  detail: string | Array<{ msg: string; loc: string[] }>;
}

export type UserRole = 'entrepreneur' | 'mentor' | 'manufacturer' | 'supplier';

export interface SignupRolePayload {
  email: string;
  password: string;
  role: UserRole;
}