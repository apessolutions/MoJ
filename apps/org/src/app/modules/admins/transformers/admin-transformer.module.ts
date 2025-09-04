import { Module } from '@nestjs/common';

import { AdminTransformer } from './admin.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [AdminTransformer],
  exports: [AdminTransformer],
})
export class AdminTransformerModule {}
