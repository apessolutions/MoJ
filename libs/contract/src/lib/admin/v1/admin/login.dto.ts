import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
