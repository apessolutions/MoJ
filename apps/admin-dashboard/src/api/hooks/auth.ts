import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError } from 'src/types/response';
import { setToken } from 'src/utils/token';

import {
  changePasswordAction,
  forgetPasswordAction,
  getMeAction,
  resetPasswordAction,
  signinAction,
  verifyCodeAction,
} from '../actions/auth';
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

export const useSigninMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<SignInResponse, ApiError<SignInPayload>, SignInPayload>({
    mutationFn: signinAction,
    onSuccess: (data) => {
      setToken(data.data.token);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ME] });
    },
  });
};

export const useGetMeQuery = () => {
  return useQuery<GetMeResponse, ApiError>({
    queryKey: [QUERY_KEYS.GET_ME],
    queryFn: getMeAction,
  });
};

export const useVerifyCodeMutation = () => {
  return useMutation<
    VerifyCodeResponse,
    ApiError<VerifyCodePayload>,
    VerifyCodePayload
  >({
    mutationFn: verifyCodeAction,
  });
};

export const useVerifyPasswordMutation = () => {
  return useMutation<
    verifyPasswordResponse,
    ApiError<verifyPasswordPayload>,
    verifyPasswordPayload
  >({
    mutationFn: verifyCodeAction,
  });
}

export const useResetPasswordMutation = () => {
  return useMutation<
    ResetPasswordResponse,
    ApiError<ResetPasswordPayload>,
    ResetPasswordPayload
  >({
    mutationFn: resetPasswordAction,
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation<
    ForgetPasswordResponse,
    ApiError<ForgetPasswordPayload>,
    ForgetPasswordPayload
  >({
    mutationFn: forgetPasswordAction,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<
    ChangePasswordResponse,
    ApiError<ChangePasswordPayload>,
    ChangePasswordPayload
  >({
    mutationFn: changePasswordAction,
  });
}
