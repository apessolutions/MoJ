import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

import { TwilioConfig } from '../config/twilio-config.type';

@Injectable()
export class TwilioOTPService {
  client!: twilio.Twilio;
  serviceId!: string;
  constructor(configService: ConfigService<TwilioConfig>) {
    this.client = twilio(
      configService.get('twilio.accountSID', { infer: true }),
      configService.get('twilio.authToken', { infer: true })
    );
    this.serviceId = configService.get('twilio.otpServiceId', { infer: true })!;
  }

  async sendOTP(phoneNumber: string) {
    await this.client.verify.v2
      .services(this.serviceId)
      .verifications.create({
        channel: 'whatsapp',
        to: phoneNumber,
      })
      .catch((error) => console.log(error));
  }

  async verifyOTP(phoneNumber: string, code: string) {
    try {
      await this.client.verify.v2
        .services(this.serviceId)
        .verificationChecks.create({
          to: phoneNumber, // Text your number
          code,
        });
      return true;
    } catch {
      return false;
    }
  }
}
