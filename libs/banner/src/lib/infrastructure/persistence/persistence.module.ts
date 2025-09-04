import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannerRepository } from '../../application/ports/banner.repository';

import { BannerEntity } from './entities/banner.entity';
import { BannerRelationalRepository } from './repositories/banner.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  providers: [
    {
      provide: BannerRepository,
      useClass: BannerRelationalRepository,
    },
  ],
  exports: [BannerRepository],
})
export class BannerPersistenceModule {}
