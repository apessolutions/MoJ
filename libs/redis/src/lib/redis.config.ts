import { registerAs } from '@nestjs/config';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Config as RedisConfig } from './redis-config.type';

import { validateConfig } from '../../../common/src/lib/utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  REDIS_HOST!: string;

  @IsNotEmpty()
  @IsInt()
  REDIS_PORT!: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD?: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env['REDIS_HOST'],
    port: parseInt(process.env['REDIS_PORT'] ?? '0'),
    password: process.env['REDIS_PASSWORD'],
  } as RedisConfig;
});
