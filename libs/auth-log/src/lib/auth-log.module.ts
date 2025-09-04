import { Module } from '@nestjs/common';
import { LoginSuccessfulListener } from './listeners/login-successful.listener';
import { LogoutListener } from './listeners/logout.listener';
import { LoginFailedListener } from './listeners/login-failed.listener';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthLogModel, AuthLogSchema } from './schemas/auth-log.schema';
import { AuthLogsService } from './auth-logs.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mongoConfig, MongoConfig } from '@./audit-trail';

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
      { name: AuthLogModel.name, schema: AuthLogSchema },
    ]),
  ],
  providers: [
    LoginSuccessfulListener,
    LoginFailedListener,
    LogoutListener,
    AuthLogsService,
  ],
})
export class AuthLogModule {}
