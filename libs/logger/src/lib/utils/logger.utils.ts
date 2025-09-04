import * as winston from 'winston';

import { LoggerService } from '../logger.service';

export function LoggerFacade(conn?: string): winston.Logger {
  return LoggerService.getConnection(conn);
}
