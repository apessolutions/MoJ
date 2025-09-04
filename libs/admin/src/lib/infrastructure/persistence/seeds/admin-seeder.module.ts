import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminEntity } from '../entities/admin.entity';

import { AdminSeeder } from './admin.seeder';

import { RolePersistenceModule } from '@./role/infrastructure/persistence/persistence.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]),RolePersistenceModule],
  providers: [AdminSeeder],
  exports: [AdminSeeder],
})
export class AdminSeederModule {}
