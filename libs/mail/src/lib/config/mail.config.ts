import { registerAs } from '@nestjs/config';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Config } from './mail-config.type';

import { validateConfig } from '../../../../common/src/lib/utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT!: number;

  @IsString()
  MAIL_HOST!: string;

  @IsString()
  @IsOptional()
  MAIL_USER!: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD!: string;

  @IsEmail()
  MAIL_DEFAULT_EMAIL!: string;

  @IsString()
  MAIL_DEFAULT_NAME!: string;

  @IsString()
  MAIL_CODE_IMG_URL!: string;

  @IsString()
  MAIL_CODE_BG_COLOR!: string;

  @IsString()
  MAIL_APP_LOGO!: string;

  @IsString()
  MAIL_SUPPORT_EMAIL!: string;
}

export default registerAs<Config>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env['MAIL_PORT']
      ? parseInt(process.env['MAIL_PORT'], 10)
      : 587,
    host: process.env['MAIL_HOST'],
    user: process.env['MAIL_USER'],
    password: process.env['MAIL_PASSWORD'],
    defaultEmail: process.env['MAIL_DEFAULT_EMAIL'],
    defaultName: process.env['MAIL_DEFAULT_NAME'],
    ignoreTLS: process.env['MAIL_IGNORE_TLS'] === 'true',
    secure: process.env['MAIL_SECURE'] === 'true',
    requireTLS: process.env['MAIL_REQUIRE_TLS'] === 'true',
    codeBgColor: process.env['MAIL_CODE_BG_COLOR'],
    codeImgUrl: process.env['MAIL_CODE_IMG_URL'],
    logoUrl: process.env['MAIL_APP_LOGO'],
    supportEmail: process.env['MAIL_SUPPORT_EMAIL'],
  } as Config;
});
