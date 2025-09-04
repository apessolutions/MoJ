/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { LoggerFacade } from './utils/logger.utils';

export default class NestjsLoggerServiceAdapter
  extends ConsoleLogger
  implements LoggerService
{
  public info(message: string): void {
    throw new Error('Method not implemented.');
  }
  public emergency(message: string | Error): void {
    throw new Error('Method not implemented.');
  }

  public override log(message: any, ..._optionalParams: any[]) {
    return LoggerFacade().info(message);
  }

  public override error(message: any, ..._optionalParams: any[]) {
    return LoggerFacade('error').error(message);
  }

  public override warn(message: any, ..._optionalParams: any[]) {
    return LoggerFacade().warn(message);
  }

  public override debug(message: any, ..._optionalParams: any[]) {
    return LoggerFacade().debug(message);
  }

  public override verbose(message: any, ..._optionalParams: any[]) {
    return LoggerFacade().info(message);
  }
}
