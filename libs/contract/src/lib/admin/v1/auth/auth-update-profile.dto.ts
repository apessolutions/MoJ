import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';

export class AuthAdminUpdateProfileDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'First Name Is Required' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: 'Last Name Is Required' })
  lastName?: string;

  @ApiProperty({ type: String, example: 'john@doe.com' })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsOptional()
  email?: string;
}
