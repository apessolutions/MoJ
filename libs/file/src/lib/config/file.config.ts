import { registerAs } from '@nestjs/config';

import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { FileDriver, Config } from './file-config.type';
import { validateConfig } from '../../../../common/src/lib/utils/validate-config.utils';

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER!: FileDriver;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED, FileDriver.S3_CLOUDFRONT].includes(
      envValues.FILE_DRIVER
    )
  )
  @IsString()
  ACCESS_KEY_ID!: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED, FileDriver.S3_CLOUDFRONT].includes(
      envValues.FILE_DRIVER
    )
  )
  @IsString()
  SECRET_ACCESS_KEY!: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED, FileDriver.S3_CLOUDFRONT].includes(
      envValues.FILE_DRIVER
    )
  )
  @IsString()
  AWS_DEFAULT_S3_BUCKET!: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED, FileDriver.S3_CLOUDFRONT].includes(
      envValues.FILE_DRIVER
    )
  )
  @IsString()
  AWS_S3_REGION!: string;

  @IsString()
  FALLBACK_URL!: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3_CLOUDFRONT].includes(envValues.FILE_DRIVER)
  )
  @IsString()
  AWS_CLOUDFRONT_URL!: string;
}

export default registerAs<Config>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    driver:
      (process.env['FILE_DRIVER'] as FileDriver | undefined) ??
      FileDriver.S3_CLOUDFRONT,
    accessKeyId: process.env['ACCESS_KEY_ID'],
    secretAccessKey: process.env['SECRET_ACCESS_KEY'],
    awsDefaultS3Bucket: process.env['AWS_DEFAULT_S3_BUCKET'],
    awsS3Region: process.env['AWS_S3_REGION'],
    maxFileSize: 5242880, // 5mb
    cloudfrontUrl: process.env['AWS_CLOUDFRONT_URL'],
  } as Config;
});
