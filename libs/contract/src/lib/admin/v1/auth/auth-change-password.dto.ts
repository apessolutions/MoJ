import { IsNotEmpty, IsString } from 'class-validator';

export class AuthAdminChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
