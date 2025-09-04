import { IsString } from 'class-validator';
import { IsValidPhoneNumber } from '../../../../../../common/src/lib/validators/phone-number.validator';
import { IsExists } from '@./database/utils/validators/is-exists.validator';
import { PhoneNumberEntity } from '../../../../../../user/src/lib/infrastructure/persistence/entities/phone-number.entity';

export class MobileVerifyOTPDto {
  @IsValidPhoneNumber()
  @IsExists(
    {
      table: PhoneNumberEntity.name,
      column: 'phone_number',
    },
    {
      message: 'Phone number is not found',
    }
  )
  phoneNumber!: string;

  @IsString()
  code!: string;
}
