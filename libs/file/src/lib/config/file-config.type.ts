export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
  S3_PRESIGNED = 's3-presigned',
  S3_CLOUDFRONT = 's3-cloudfront',
}

export type Config = {
  driver: FileDriver;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
  fallbackUrl: string;
  cloudfrontUrl: string;
};

export type FileConfig = {
  file: Config;
};
