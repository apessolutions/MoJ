import { useCallback, useMemo } from 'react';
import {
  useForgetPasswordMutation,
  useGetMeQuery,
  useResetPasswordMutation,
  useVerifyCodeMutation,
} from 'src/api/hooks/auth';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const {
    data: { data: user } = {},
    isPending: loading,
    refetch,
  } = useGetMeQuery();

  const checkUserSession = useCallback(async () => {
    refetch();
  }, [refetch]);

  // ----------------------------------------------------------------------
  const { mutateAsync: verifyCodeAction } = useVerifyCodeMutation();
  const verifyCode = useCallback(
    async (email: string, code: string) => {
      await verifyCodeAction({
        email,
        code,
      });
    },
    [verifyCodeAction]
  );

  // RESET PASSWORD
  const { mutateAsync: resetPasswordAction } = useResetPasswordMutation();
  const resetPassword = useCallback(
    async (
      email: string,
      code: string,
      password: string,
      passwordConfirmation: string
    ) => {
      await resetPasswordAction({
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
    },
    [resetPasswordAction]
  );

  // FORGET PASSWORD
  const { mutateAsync: forgetPasswordAction } = useForgetPasswordMutation();
  const forgotPassword = useCallback(
    async (email: string) => {
      await forgetPasswordAction({
        email,
      });
    },
    [forgetPasswordAction]
  );

  const checkAuthenticated = user ? 'authenticated' : 'unauthenticated';

  const status = loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: user || null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      resetPassword,
      forgotPassword,
      verifyCode,
    }),
    [checkUserSession, forgotPassword, resetPassword, status, user, verifyCode]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
