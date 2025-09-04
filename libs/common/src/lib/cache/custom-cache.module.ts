/* eslint-disable @nx/enforce-module-boundaries */
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CustomCacheService } from './custom-cache.service';
import { RedisConfig } from '@./redis/redis-config.type';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<RedisConfig>) => {
        const store = await redisStore({
          password: configService.get('redis.password', { infer: true }),
          socket: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.password', { infer: true }),
          },
        });
        return {
          ttl: 60 * 60 * 1000,
          store,
        };
      },
    }),
  ],
  providers: [CustomCacheService],
  exports: [CustomCacheService],
})
export class CustomCacheModule {}
