import DailyRotateFile = require('winston-daily-rotate-file');
import * as winston from 'winston';
import { LogLevel } from '../interfaces/logger.interface';

export type IFileTransportOption = {
  prefix: string;
  appName: string;
  level: LogLevel;
};

export default class FileTransport {
  public static create(opts: IFileTransportOption) {
    return new DailyRotateFile({
      dirname: `logs/${opts.appName}`,
      filename: `${opts.prefix}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
      level: opts.level,
      format: winston.format.combine(
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
        winston.format.json(),
      ),
    });
  }
}
