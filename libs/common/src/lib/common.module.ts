import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { LoggerOptions } from 'winston';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import SMSSenderService from './services/sms.service';
import { ConnekioService } from './providers/sms/connekio.provider';
import { FirebaseModule } from './providers/firebase/firebase.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '../../../redis/src/lib/redis-config.type';
import { TwilioModule } from './providers/twilio/twilio.module';
import { HttpModule } from '@nestjs/axios';
import { ParamsSetterInterceptor } from './interceptors/params-setter.interceptor';
import { GoogleModule } from './providers/google/google.module';
import { S3Service } from './services/s3.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JOB_QUEUE } from './constants/jobs.constants';
import { OTPService } from './services/otp.service';
import { LoggerModule } from '../../../logger/src/lib/logger.module';
import { JOBS } from './jobs';

@Global()
@Module({})
export class CommonModule {
  static register(
    clsMiddleware: boolean,
    loggerOptions: Record<string, LoggerOptions>,
    logDirectory: string
  ): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService<RedisConfig>) => {
            return {
              redis: {
                host: configService.get('redis.host', { infer: true }),
                port: configService.get('redis.port', { infer: true }),
                password: configService.get('redis.password', { infer: true }),
              },
            };
          },
        }),
        BullModule.registerQueue({
          name: JOB_QUEUE,
        }),
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: clsMiddleware,
          },
        }),
        LoggerModule.register(
          {
            isGlobal: true,
            default: 'log',
            disableConsole: false,
            loggers: loggerOptions,
          },
          logDirectory
        ),
        ScheduleModule.forRoot(),
        FirebaseModule,
        TwilioModule,
        HttpModule,
        GoogleModule,
      ],
      providers: [
        ConfigService,
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ParamsSetterInterceptor,
        },
        OTPService,
        SMSSenderService,
        ConnekioService,
        S3Service,
        ...JOBS,
      ],
      exports: [
        OTPService,
        ConfigService,
        ConnekioService,
        SMSSenderService,
        FirebaseModule,
        BullModule,
        TwilioModule,
        GoogleModule,
        S3Service,
      ],
    };
  }
}
