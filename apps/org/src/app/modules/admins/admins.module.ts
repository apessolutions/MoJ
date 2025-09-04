import { Module } from '@nestjs/common';

import { RolesModule } from '../roles/roles.module';

import { V1AdminControllers } from './controllers/v1';
import { AdminTransformerModule } from './transformers/admin-transformer.module';

import { AdminModule } from '@./admin/admin.module';
import { AdminPersistenceModule } from '@./admin/infrastructure/persistence/persistence.module';

@Module({
  imports: [RolesModule, AdminTransformerModule, AdminModule],
  controllers: [V1AdminControllers],
  providers: [],
  exports: [],
})
export class AdminsModule {}
