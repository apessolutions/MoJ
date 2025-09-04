import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ConfigFactory,
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';

// eslint-disable-next-line @nx/enforce-module-boundaries
import authConfig from '../../../auth/src/lib/config/auth.config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import databaseConfig from '../../../database/src/lib/config/database.config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import fileConfig from '../../../file/src/lib/config/file.config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import redisConfig from '../../../redis/src/lib/redis.config';

import appConfig from './app.config';
import smsConfig from './sms.config';

@Global()
@Module({})
export class ConfigModule {
  static register(configs: ConfigFactory[]): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          load: [
            appConfig,
            redisConfig,
            smsConfig,
            fileConfig,
            authConfig,
            databaseConfig,
            ...configs,
          ],
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
