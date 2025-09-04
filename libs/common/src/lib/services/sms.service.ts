import { Injectable } from '@nestjs/common';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ConnekioService } from '../providers/sms/connekio.provider';
const phoneNumberUtil = PhoneNumberUtil.getInstance();

@Injectable()
export class SMSSenderService {
  constructor(private readonly connekioService: ConnekioService) {}

  public sendMessage(phoneNumber: string, message: string) {
    const parsedPhoneNumber = phoneNumberUtil.parseAndKeepRawInput(
      phoneNumber,
      '',
    );
    const countryCode =
      phoneNumberUtil.getRegionCodeForNumber(parsedPhoneNumber);

    switch (countryCode) {
      case 'EG':
        this.connekioService.sendSMS(phoneNumber, message);
        break;
    }
  }
}

export default SMSSenderService;
