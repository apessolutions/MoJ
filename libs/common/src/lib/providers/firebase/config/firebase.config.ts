import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { validateConfig } from '../../../utils/validate-config.utils';

import { Config as FirebaseConfig } from './firebase-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  FIREBASE_TYPE!: string;
  @IsString()
  FIREBASE_PROJECT_ID!: string;
  @IsString()
  FIREBASE_PRIVATE_KEY_ID!: string;
  @IsString()
  FIREBASE_PRIVATE_KEY!: string;
  @IsString()
  FIREBASE_CLIENT_EMAIL!: string;
  @IsString()
  FIREBASE_CLIENT_ID!: string;
  @IsString()
  FIREBASE_AUTH_URI!: string;
  @IsString()
  FIREBASE_TOKEN_URI!: string;
  @IsString()
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL!: string;
  @IsString()
  FIREBASE_CLIENT_X509_CERT_URL!: string;
}

export default registerAs<FirebaseConfig>('firebase', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    type: process.env['FIREBASE_TYPE'],
    project_id: process.env['FIREBASE_PROJECT_ID'],
    private_key_id: process.env['FIREBASE_PRIVATE_KEY_ID'],
    private_key: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    client_email: process.env['FIREBASE_CLIENT_EMAIL'],
    client_id: process.env['FIREBASE_CLIENT_ID'],
    auth_uri: process.env['FIREBASE_AUTH_URI'],
    token_uri: process.env['FIREBASE_TOKEN_URI'],
    auth_provider_x509_cert_url:
      process.env['FIREBASE_AUTH_PROVIDER_X509_CERT_UR'],
    client_x509_cert_url: process.env['FIREBASE_CLIENT_X509_CERT_URL'],
  } as FirebaseConfig;
});
