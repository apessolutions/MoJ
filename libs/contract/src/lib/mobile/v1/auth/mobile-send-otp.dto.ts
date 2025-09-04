import { IsValidPhoneNumber } from '@./common/validators/phone-number.validator';

export class MobileSendOTPDto {
  @IsValidPhoneNumber()
  phoneNumber!: string;
}
