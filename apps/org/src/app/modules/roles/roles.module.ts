import { Module } from '@nestjs/common';

import { V1RolesControllers } from './controllers/v1';
import { RoleTransformerModule } from './transformers/roles-transformer.module';

import { RoleModule } from '@./role/role.module';
@Module({
  imports: [RoleModule, RoleTransformerModule],
  controllers: [V1RolesControllers],
  providers: [],
  exports: [],
})
export class RolesModule {}
