import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { IsEmail } from 'class-validator';

export class AuthAdminForgotPasswordDto {
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email!: string;
}
