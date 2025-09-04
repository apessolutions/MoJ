import { Module } from '@nestjs/common';

import { UserTransformer } from './users.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [UserTransformer],
  exports: [UserTransformer],
})
export class UserTransformerModule {}
