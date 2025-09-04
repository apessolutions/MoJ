/* eslint-disable @nx/enforce-module-boundaries */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';

export class AuthAdminVerifyForgetPasswordOtpDto {
  @ApiProperty({ type: String, example: 'john@doe.com' })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  @Length(4, 4)
  code!: string;
}
