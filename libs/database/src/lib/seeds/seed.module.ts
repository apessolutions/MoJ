import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';

import { AdminSeederModule } from '../../../../admin/src/lib/infrastructure/persistence/seeds/admin-seeder.module';
import { CommonModule } from '../../../../common/src/lib/common.module';
import { ConfigModule } from '../../../../config/src/lib/config.module';

@Module({
  imports: [
    AdminSeederModule,
    ConfigModule.register([]),
    CommonModule.register(true, {}, 'seeder-logs'),
    DatabaseModule,
  ],
})
export class SeedModule {}
