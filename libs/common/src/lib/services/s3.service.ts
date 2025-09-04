import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { FileConfig } from '../../../../file/src/lib/config/file-config.type';

@Injectable()
export class S3Service {
  logger = new Logger(S3Service.name);
  bucket: string;

  constructor(private readonly configService: ConfigService<FileConfig>) {
    this.bucket = configService.getOrThrow('file.awsDefaultS3Bucket', {
      infer: true,
    });
  }

  private _createS3Client() {
    return new S3Client({
      region: this.configService.get('file.awsS3Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.accessKeyId', {
          infer: true,
        }),
        secretAccessKey: this.configService.getOrThrow('file.secretAccessKey', {
          infer: true,
        }),
      },
    });
  }

  // Express.Multer.File
  async uploadFile(file: any) {
    try {
      if (!file)
        throw new BadRequestException('mediaFile should be a valid file');
      const fileExtension = file.originalname.split('.').pop();
      if (!(file.mimetype.includes('image') || file.mimetype.includes('video')))
        throw new BadRequestException('mediaFile must be an image or a video');
      const fileKey = randomUUID().toString() + '.' + fileExtension;
      const createCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        ACL: 'private',
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this._createS3Client().send(createCommand);
      return fileKey;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async upload(data: Buffer, contentType: string, key: string) {
    try {
      await this._createS3Client().send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: data,
          ContentType: contentType,
          ACL: 'private',
        })
      );
      return key;
    } catch (err) {
      this.logger.error('Error uploading database backup to S3:', err);
    }
  }

  async deleteKey(Key: string) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key,
      });
      await this._createS3Client().send(deleteCommand);
    } catch (error) {
      return null;
    }
  }

  async getTempLink(fileName: string) {
    if (fileName == null) return;
    if (fileName.includes('http')) return fileName;

    return `${this.configService.get('file.cloudfrontUrl', {
      infer: true,
    })}/${fileName}`;
  }

  async list(prefix: string) {
    try {
      const client = this._createS3Client();

      const listCommand = new ListObjectsCommand({
        Bucket: this.bucket,
        Prefix: prefix,
      });

      const { Contents } = await client.send(listCommand);
      return Contents;
    } catch (e) {
      this.logger.error(`Error in listing ${JSON.stringify(e)}`);
    }
    return [];
  }
}
