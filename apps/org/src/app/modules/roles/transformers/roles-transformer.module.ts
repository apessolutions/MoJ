import { Module } from '@nestjs/common';

import { RoleTransformer } from './roles.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [RoleTransformer],
  exports: [RoleTransformer],
})
export class RoleTransformerModule {}
