import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import path from 'path';
import { MailConfig } from './config/mail-config.type';
import { MailerService } from './mailer.service';
import { MaybeType } from '@./common/types/maybe.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<MailConfig>
  ) {}

  async forgotPassword(mailData: MailData<{ code: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      templatePath: path.join(__dirname, '../../../libs/mail/src/lib/mail-templates', 'code.hbs'),
      context: {
        code: mailData.data.code,
        logoUrl: this.configService.get('mail.logoUrl', { infer: true }),
        codeImgUrl: this.configService.get('mail.codeImgUrl', { infer: true }),
        appName: this.configService.get('mail.defaultName', { infer: true }),
        codeBgColor: this.configService.get('mail.codeBgColor', {
          infer: true,
        }),
        supportEmail: this.configService.get('mail.supportEmail', {
          infer: true,
        }),
      },
    });
  }
}
