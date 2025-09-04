import { Module } from '@nestjs/common';
import { SessionModule } from 'libs/session/src/lib/session.module';
import { AdminService } from './application/services/admin.service';
import { AdminPersistenceModule } from './infrastructure/persistence/persistence.module';
import { RoleModule } from 'libs/role/src/lib/role.module';

@Module({
  imports: [SessionModule, AdminPersistenceModule, RoleModule],
  controllers: [],
  providers: [AdminService],
  exports: [AdminService, AdminPersistenceModule],
})
export class AdminModule {}
