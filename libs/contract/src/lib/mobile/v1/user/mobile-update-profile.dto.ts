import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { GenderEnum } from '../../../../../../common/src/lib/enums/gender.enum';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class MobileUpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'First name should not be empty' })
  @IsNotEmpty()
  @MaxLength(20, { message: 'First name should maximum 20 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name should not be empty' })
  @IsNotEmpty()
  @MaxLength(20, { message: 'Last name should maximum 20 characters' })
  lastName?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @Trim()
  @ToLowerCase()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth is invalid' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName?: string;
}
