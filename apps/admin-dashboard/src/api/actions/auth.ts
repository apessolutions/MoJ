import { endpoints } from 'src/utils/axios';

import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  GetMeResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignInPayload,
  SignInResponse,
  VerifyCodePayload,
  VerifyCodeResponse,
  verifyPasswordPayload,
  verifyPasswordResponse,
} from '../types/auth';
import { httpClient } from '..';
export const signinAction = async (payload: SignInPayload) => {
  const response = await httpClient.post<SignInResponse>(
    endpoints.auth.signIn,
    payload
  );

  return response.data;
};

export const getMeAction = async () => {
  const response = await httpClient.get<GetMeResponse>(endpoints.auth.me);

  return response.data;
};

export const verifyCodeAction = async (payload: VerifyCodePayload) => {
  const response = await httpClient.post<VerifyCodeResponse>(
    endpoints.password.verify,
    payload
  );
  return response.data;
};

export const verifyPasswordAction = async (payload: verifyPasswordPayload) => {
  const response = await httpClient.post<verifyPasswordResponse>(
    endpoints.password.verify,
    payload
  );
  return response.data;
};

export const resetPasswordAction = async (payload: ResetPasswordPayload) => {
  const response = await httpClient.post<ResetPasswordResponse>(
    endpoints.password.reset,
    payload
  );
  return response.data;
};

export const forgetPasswordAction = async (payload: ForgetPasswordPayload) => {
  const response = await httpClient.post<ForgetPasswordResponse>(
    endpoints.password.forget,
    payload
  );
  return response.data;
};

export const changePasswordAction = async (payload: ChangePasswordPayload) => {
  const response = await httpClient.post<ChangePasswordResponse>(
    endpoints.auth.changePassword,
    payload
  );
  return response.data;
};
