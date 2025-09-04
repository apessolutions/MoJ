import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminRepository } from '../../application/ports/admin.repository';

import { AdminEntity } from './entities/admin.entity';
import { AdminRelationalRepository } from './repositories/admin.repository';

import { RolePersistenceModule } from '../../../../../role/src/lib/infrastructure/persistence/persistence.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), RolePersistenceModule],
  providers: [
    {
      provide: AdminRepository,
      useClass: AdminRelationalRepository,
    },
  ],
  exports: [AdminRepository],
})
export class AdminPersistenceModule {}
