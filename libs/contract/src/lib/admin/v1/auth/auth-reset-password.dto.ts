import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthAdminResetPasswordDto {
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  code!: string;
}
