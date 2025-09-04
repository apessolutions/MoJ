import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import mongoConfig from './config/mongo.config';
import { MongoConfig } from './config/mongo-config.type';
import {
  AuditTrailModel,
  AuditTrailSchema,
} from './schemas/audit-trail.schema';
import { AuditSubscriber } from './subscribers/audit.subscriber';
import { AuditTrailsService } from './audit-trails.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongoConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<MongoConfig>) => {
        return {
          uri: configService.get('mongo.url', { infer: true }),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AuditTrailModel.name, schema: AuditTrailSchema },
    ]),
  ],
  providers: [AuditTrailsService, AuditSubscriber],
  exports: [],
})
export class AuditTrailModule {}
