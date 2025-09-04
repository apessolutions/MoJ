/* eslint-disable @nx/enforce-module-boundaries */
import { ApiResponse } from 'src/types/response';

import { LoginDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/login.dto';
import { AdminInfoDto } from '../../../../../libs/contract/src/lib/admin/v1/auth/admin-info.dto';

// ========================== Sign In ====================================
export type SignInPayload = LoginDto;
export type SignInResponse = ApiResponse<{
  token: string;
  tokenExpires: number;
  admin: AdminInfoDto;
}>;

// ========================== Get Me ====================================
export type GetMeResponse = ApiResponse<AdminInfoDto>;

// ========================== Verify Code ====================================
export type VerifyCodePayload = {
  email: string;
  code: string;
};
export type VerifyCodeResponse = ApiResponse<void>;
// ========================== verify forget Password ====================================
export type verifyPasswordPayload = {
  email: string;
  code: string;
};
export type verifyPasswordResponse = ApiResponse<void>;
// ========================== Reset Password ====================================
export type ResetPasswordPayload = {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
};
export type ResetPasswordResponse = ApiResponse<void>;

// ========================== Forget Password ====================================
export type ForgetPasswordPayload = {
  email: string;
};
export type ForgetPasswordResponse = ApiResponse<void>;

// ========================== Change Password ====================================
export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};
export type ChangePasswordResponse = ApiResponse<void>;

