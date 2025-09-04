import { SMSConfig } from './sms.config';
import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../../../database/src/lib/config/database-config.type';
import { MongoConfig } from '@./audit-trail/config/mongo-config.type';
import { RedisConfig } from '@./redis/redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  mongo: MongoConfig;
  sms: SMSConfig;
};
