/* eslint-disable @nx/enforce-module-boundaries */
import { registerAs } from '@nestjs/config';
import { IsOptional } from 'class-validator';
import { validateConfig } from '../../../common/src/lib/utils/validate-config.utils';
import { MaybeType } from '@./common/types/maybe.type';

export interface Config {
  conneckioAccountId: string;
  conneckioSenderName: string;
  conneckioAPIKey: string;
}

export interface SMSConfig {
  sms: Config;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class EnvironmentVariablesValidator {
  @IsOptional()
  CONNEKIO_ACCOUNT_ID: MaybeType<string>;

  @IsOptional()
  CONNEKIO_SENDER_NAME: MaybeType<string>;

  @IsOptional()
  CONNEKIO_API_KEY: MaybeType<string>;
}

export default registerAs<Config>('sms', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    conneckioAccountId: process.env['CONNEKIO_ACCOUNT_ID'] || 0,
    conneckioSenderName: process.env['CONNEKIO_SENDER_NAME'] || '',
    conneckioAPIKey: process.env['CONNEKIO_API_KEY'] || '',
  } as Config;
});
