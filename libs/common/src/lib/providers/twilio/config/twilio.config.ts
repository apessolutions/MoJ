import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { validateConfig } from '../../../utils/validate-config.utils';

import { Config as TwilioConfig } from './twilio-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  TWILIO_ACCOUNT_SID!: string;
  @IsString()
  TWILIO_AUTH_TOKEN!: string;
  @IsString()
  TWILIO_OTP_SERVICE_ID!: string;
}

export default registerAs<TwilioConfig>('twilio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountSID: process.env['TWILIO_ACCOUNT_SID'],
    authToken: process.env['TWILIO_AUTH_TOKEN'],
    otpServiceId: process.env['TWILIO_OTP_SERVICE_ID'],
  } as TwilioConfig;
});
