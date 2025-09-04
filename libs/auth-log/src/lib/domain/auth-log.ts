import { NullableType, UserTypeEnum } from '@./common';

export class AuthLog {
  userId!: NullableType<number>;
  userType!: UserTypeEnum;
  loginSuccessful!: boolean;
  loginAt?: Date;
  logoutAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}
