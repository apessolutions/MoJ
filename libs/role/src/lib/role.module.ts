import { Module } from '@nestjs/common';

import { RoleService } from './application/services/role.service';
import { RolePersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [RolePersistenceModule],
  providers: [RoleService],
  exports: [RoleService, RolePersistenceModule],
})
export class RoleModule {}
