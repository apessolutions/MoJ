import { Module } from '@nestjs/common';
import { BannerModule as RootBannerModule } from '../../../../../../libs/banner/src/lib/banner.module';
import { V1BannersControllers } from './controllers/v1';

import { BannersService } from './services/banners.service';
import { BannerTransformerModule } from './transformers/banners-transformer.module';
import { BannerValidatorFactory } from '@./banner/application/factories/banner-validation.factory';

@Module({
  imports: [RootBannerModule, BannerTransformerModule],
  controllers: [V1BannersControllers],
  providers: [BannersService, BannerValidatorFactory],
  exports: [BannersService, BannerTransformerModule],
})
export class BannerModule {}
