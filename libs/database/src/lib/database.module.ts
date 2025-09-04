import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './services/typeorm-database-config.service';
import { IsExistConstraint } from './utils/validators/is-exists.validator';
import { IsNotExistConstraint } from './utils/validators/is-not-exists.validator';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataSourceFactory: (options: DataSourceOptions): any => {
        return addTransactionalDataSource(new DataSource(options)).initialize();
      },
    }),
  ],
  controllers: [],
  providers: [IsExistConstraint, IsNotExistConstraint],
  exports: [IsExistConstraint, IsNotExistConstraint],
})
export class DatabaseModule {}
