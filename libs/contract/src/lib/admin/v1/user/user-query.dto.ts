import { IsValidPhoneNumber } from '@./common/validators/phone-number.validator';
import { IsNotEmpty } from 'class-validator';

export class UserQueryDto {
  @IsNotEmpty()
  @IsValidPhoneNumber()
  phoneNumber!: string;
}
