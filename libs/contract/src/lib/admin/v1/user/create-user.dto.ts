/* eslint-disable @nx/enforce-module-boundaries */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { GenderEnum } from '@./common/enums/gender.enum';
import { NullableType } from '@./common/types/nullable.type';
import { IsValidPhoneNumber } from '@./common/validators/phone-number.validator';
import { IsNotExists } from '@./database/utils/validators/is-not-exists.validator';
import { UserEntity } from '@./user/infrastructure/persistence/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ type: String, example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName?: NullableType<string>;

  @ApiProperty({ type: String, example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName?: NullableType<string>;

  @ApiProperty({ type: String, example: GenderEnum.MALE })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: NullableType<GenderEnum>;

  @ApiProperty({ type: String, example: 'john@doe.com' })
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsNotExists(
    {
      table: UserEntity.name,
      column: 'email',
      ignoreColumn: 'id',
    },
    {
      message: 'Email already exists',
    }
  )
  email?: NullableType<string>;

  @ApiProperty({ type: String, example: '09123456789' })
  @IsString()
  @IsNotExists(
    {
      table: UserEntity.name,
      column: 'phoneNumber',
      ignoreColumn: 'id',
    },
    {
      message: 'Phone number already exists',
    }
  )
  @IsValidPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({ type: String, example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: NullableType<string>;

  @ApiProperty({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  status!: boolean;
}
