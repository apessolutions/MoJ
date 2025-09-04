import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { AppConfig } from './app-config.type';

import { ToInt } from '../../../common/src/lib/decorators/transform.decorators';
import { MaybeType } from '../../../common/src/lib/types/maybe.type';
import { validateConfig } from '../../../common/src/lib/utils/validate-config.utils';

export enum EnvironmentEnum {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(EnvironmentEnum)
  @IsOptional()
  NODE_ENV: MaybeType<EnvironmentEnum>;

  @ToInt()
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: MaybeType<number>;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: MaybeType<string>;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: MaybeType<string>;

  @IsString()
  @IsOptional()
  API_PREFIX: MaybeType<string>;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: MaybeType<string>;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: MaybeType<string>;

  @IsString()
  @IsOptional()
  TIMEZONE: MaybeType<string>;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env['NODE_ENV'] || 'development',
    name: process.env['APP_NAME'] || 'app',
    frontendDomain: process.env['FRONTEND_DOMAIN'],
    backendDomain: process.env['BACKEND_DOMAIN'] ?? 'http://localhost',
    port: process.env['APP_PORT']
      ? parseInt(process.env['APP_PORT'], 10)
      : process.env['PORT']
      ? parseInt(process.env['PORT'], 10)
      : 3000,
    apiPrefix: process.env['API_PREFIX'] || 'api',
    fallbackLanguage: process.env['APP_FALLBACK_LANGUAGE'] || 'en',
    headerLanguage: process.env['APP_HEADER_LANGUAGE'] || 'x-custom-lang',
  } as AppConfig;
});
