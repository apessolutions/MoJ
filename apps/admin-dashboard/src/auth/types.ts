// eslint-disable-next-line @nx/enforce-module-boundaries
import { AdminInfoDto } from '../../../../libs/contract/src/lib/admin/v1/auth/admin-info.dto';

// TODO: Ask for Permission
export type UserType = AdminInfoDto | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
};
