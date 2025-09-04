import { AdminInfoDto } from '@./auth/dto/admin/v1/admin-info.dto';
import { UserDto } from '@./users/dto/admin/v1/user.dto';

export type LoginResponseType = Readonly<{
  token: string;
  tokenExpires: number;
}>;

export type AdminLoginResponseType = LoginResponseType & {
  admin: AdminInfoDto;
};

export type UserLoginResponseType = LoginResponseType & {
  user: UserDto;
};
