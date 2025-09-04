import { Module } from '@nestjs/common';

import { AuthTransformer } from './auth.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthTransformer],
  exports: [AuthTransformer],
})
export class AuthTransformerModule {}
