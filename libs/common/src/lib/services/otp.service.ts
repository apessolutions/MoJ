/*
    OTP: One-time Password Algorithm
    The code here will be changed based on the method you use to generate the OTP later.
*/
import otpGenerator from 'otp-generator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../config/src/lib/config.type';
import { EnvironmentEnum } from '../../../../config/src/lib/app.config';

@Injectable()
export class OTPService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  public generateOTP = (): string => {
    if (
      this.configService.get('app.nodeEnv', { infer: true }) ===
      EnvironmentEnum.Development
    ) {
      return '1234';
    } else {
      return otpGenerator
        .generate(4, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        })
        .toString();
    }
  };
}
