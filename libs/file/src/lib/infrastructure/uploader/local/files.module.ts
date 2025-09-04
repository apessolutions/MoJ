import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FileConfig } from '../../../config/file-config.type';
import { FilePersistenceModule } from '../../persistence/persistence.module';

import { FilesLocalController } from './files.controller';
import { FilesLocalService } from './files.service';

@Module({
  imports: [
    FilePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<FileConfig>) => {
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false
              );
            }

            callback(null, true);
          },
          storage: diskStorage({
            destination: './files',
            filename: (request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', {
              infer: true,
            }),
          },
        };
      },
    }),
  ],
  controllers: [FilesLocalController],
  providers: [ConfigModule, ConfigService, FilesLocalService],
  exports: [FilesLocalService],
})
export class FilesLocalModule {}
