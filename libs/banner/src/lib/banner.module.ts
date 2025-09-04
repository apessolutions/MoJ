/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';

import { BannerValidatorFactory } from './application/factories/banner-validation.factory';
import { BannerPersistenceModule } from './infrastructure/persistence/persistence.module';

import { FilePersistenceModule } from '@./file/infrastructure/persistence/persistence.module';

@Module({
  imports: [BannerPersistenceModule, FilePersistenceModule],
  controllers: [],
  providers: [BannerValidatorFactory],
  exports: [
    BannerPersistenceModule,
    FilePersistenceModule,
    BannerValidatorFactory,
  ],
})
export class BannerModule {}
