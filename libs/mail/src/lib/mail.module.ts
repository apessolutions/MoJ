import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import mailConfig from './config/mail.config';
import { MailService } from './mail.service';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mailConfig],
    }),
  ],
  providers: [MailService, MailerService],
  exports: [MailService],
})
export class MailModule {}
