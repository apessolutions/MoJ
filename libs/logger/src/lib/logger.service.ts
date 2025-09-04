import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as TransportStream from 'winston-transport';

import { LoggerConstants } from './constants/logger.constant';
import { LogLevel, SqbLoggerOptions } from './interfaces/logger.interface';

@Injectable()
export class LoggerService {
  private static config: SqbLoggerOptions;
  private static options: any = {};

  constructor(
    @Inject(LoggerConstants.loggerOptions) readonly config: SqbLoggerOptions
  ) {
    LoggerService.config = config;
    for (const conn in LoggerService.config.loggers) {
      LoggerService.options[conn] = LoggerService.createLogger(conn);
    }
  }

  static getConnection(conn?: string) {
    conn = conn || LoggerService.config.default;
    const availableLoggers = Object.keys(LoggerService.options);
    if (!availableLoggers.includes(conn as string)) {
      throw new Error(`Cannot find any logger with name: ${conn}`);
    }

    if (LoggerService.options[conn as string]) {
      return LoggerService.options[conn as string];
    }

    const connection = this.createLogger(conn as string);
    LoggerService.options[conn as string] = connection;
    return connection;
  }

  private static getLoggerFormatOptions(options: winston.LoggerOptions) {
    // Setting log levels for winston
    const levels: any = {};
    let cont = 0;
    Object.values(LogLevel).forEach((level) => {
      levels[level] = cont;
      cont++;
    });

    return {
      // level: LogLevel.Debug,
      levels: levels,
      format: winston.format.combine(
        // Add timestamp and format the date
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        // Errors will be logged with stack trace
        winston.format.errors({ stack: true }),
        // Add custom Log fields to the log
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        winston.format((info, _) => {
          // Info contains an Error property
          if (info['error'] && info['error'] instanceof Error) {
            info['stack'] = info['error'].stack;
            info['error'] = undefined;
          }

          return info;
        })(),
        // Add custom fields to the data property
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        // Format the log as JSON
        winston.format.json()
      ),
      ...options,
    };
  }

  static createLogger(conn: string) {
    const options = LoggerService.config.loggers[conn];
    if (LoggerService.config.disableConsole) {
      const transports = options.transports as TransportStream[];
      options.transports = transports.filter(
        (transport) => !(transport instanceof winston.transports.Console)
      );
    }
    return winston.createLogger(this.getLoggerFormatOptions(options));
  }
}
