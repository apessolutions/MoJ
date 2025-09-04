import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import twilioConfig from './config/twilio.config';
import { TwilioOTPService } from './services/twilio-otp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [twilioConfig],
    }),
  ],
  providers: [TwilioOTPService],
  exports: [TwilioOTPService],
})
export class TwilioModule {}
