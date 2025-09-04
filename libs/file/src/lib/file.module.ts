import { DynamicModule, Module } from '@nestjs/common';

import { FilesService } from './application/services/files.service';
import fileConfig from './config/file.config';
import { Config as FileConfig, FileDriver } from './config/file-config.type';
import { FilePersistenceModule } from './infrastructure/persistence/persistence.module';
import { FilesLocalModule } from './infrastructure/uploader/local/files.module';
import { FilesS3Module } from './infrastructure/uploader/s3/files.module';
import { FilesS3PresignedModule } from './infrastructure/uploader/s3-presigned/files.module';

@Module({})
export class FileModule {
  static register(): DynamicModule {
    const infrastructureUploaderModule =
      (fileConfig() as FileConfig).driver === FileDriver.LOCAL
        ? FilesLocalModule
        : [FileDriver.S3_PRESIGNED, FileDriver.S3].includes(
            (fileConfig() as FileConfig).driver
          )
        ? FilesS3Module
        : FilesS3PresignedModule;
    return {
      module: FileModule,
      imports: [FilePersistenceModule, infrastructureUploaderModule],
      providers: [FilesService],
      exports: [FilesService, FilePersistenceModule],
    };
  }
}
