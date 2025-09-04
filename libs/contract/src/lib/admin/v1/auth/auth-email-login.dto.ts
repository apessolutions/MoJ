import { IsEmail, IsNotEmpty } from 'class-validator';

import {
  ToLowerCase,
  Trim,
} from '../../../../../../common/src/lib/decorators/transform.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class AuthAdminEmailLoginDto {
  @ApiProperty({ type: String, example: 'apes@apessmartsolutions.com' })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
