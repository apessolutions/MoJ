import { Module } from '@nestjs/common';

import { BannerTransformer } from './banners.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [BannerTransformer],
  exports: [BannerTransformer],
})
export class BannerTransformerModule {}
