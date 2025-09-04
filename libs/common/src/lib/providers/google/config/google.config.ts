import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

import { validateConfig } from '../../../utils/validate-config.utils';

import { Config as GoogleConfig } from './google-config.type';

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  GOOGLE_API_KEY?: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    googleApiKey: process.env['GOOGLE_API_KEY'] ?? '',
    mapUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
  } as GoogleConfig;
});
