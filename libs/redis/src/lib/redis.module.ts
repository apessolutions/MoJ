import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import redisConfig from './redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [redisConfig],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
