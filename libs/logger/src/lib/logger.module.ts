import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  Type,
} from '@nestjs/common';

import { LoggerService } from './logger.service';
import {
  LogLevel,
  SqbLoggerAsyncOptions,
  SqbLoggerAsyncOptionsFactory,
  SqbLoggerOptions,
} from './interfaces/logger.interface';
import { LoggerConstants } from './constants/logger.constant';
import NestjsLoggerServiceAdapter from './nestjs-adapter.service';
import { loggerMiddleware } from './middleware/logger.middleware';
import FileTransport from './transports/file.transport';
import ConsoleTransport from './transports/console.transport';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule implements NestModule {
  /**
   * Register options
   * @param options
   */
  static register(options: SqbLoggerOptions, appName: string): DynamicModule {
    const defaultLoggers = {
      debug: {
        level: LogLevel.Debug,
        transports: [ConsoleTransport.createColorize()],
      },
      log: {
        level: LogLevel.Debug,
        transports: [
          FileTransport.create({
            level: LogLevel.Debug,
            prefix: 'log',
            appName,
          }),
        ],
      },
      error: {
        level: LogLevel.Debug,
        transports: [
          ConsoleTransport.createColorize(),
          FileTransport.create({
            level: LogLevel.Error,
            prefix: 'error',
            appName,
          }),
        ],
      },
    };
    options.loggers = {
      ...defaultLoggers,
      ...options.loggers,
    };
    return {
      global: options.isGlobal || false,
      module: LoggerModule,
      imports: [],
      exports: [NestjsLoggerServiceAdapter],
      providers: [
        LoggerService,
        NestjsLoggerServiceAdapter,
        { provide: LoggerConstants.loggerOptions, useValue: options },
      ],
    };
  }

  static registerAsync(options: SqbLoggerAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: LoggerModule,
      imports: [],
      exports: [NestjsLoggerServiceAdapter],
      providers: [
        LoggerService,
        NestjsLoggerServiceAdapter,
        this.createLoggerOptions(options),
      ],
    };
  }

  private static createLoggerOptions(options: SqbLoggerAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: LoggerConstants.loggerOptions,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<SqbLoggerOptions>,
    ];

    return {
      provide: LoggerConstants.loggerOptions,
      useFactory: async (optionsFactory: SqbLoggerAsyncOptionsFactory) =>
        await optionsFactory.createLoggerOptions(),
      inject,
    };
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(loggerMiddleware([], 'log')).forRoutes('*');
  }
}
