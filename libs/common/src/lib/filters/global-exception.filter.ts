import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import {
  default as appConfig,
  EnvironmentEnum,
} from '../../../../config/src/lib/app.config';
import { AppConfig } from '../../../../config/src/lib/app-config.type';
import { formatRequest } from '../../../../logger/src/lib/utils/format.utils';
import { LoggerFacade } from '../../../../logger/src/lib/utils/logger.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const request = formatRequest(ctx.getRequest());
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      this.logger.error(exception.stack || 'No Stack');
      LoggerFacade('error').error(
        `Request ${JSON.stringify(request)} Response ${JSON.stringify(
          exceptionResponse
        )} Stack ${
          (appConfig() as AppConfig).nodeEnv === EnvironmentEnum.Development
            ? JSON.stringify(exception.stack)
            : ''
        }`
      );

      response.status(status).json({
        statusCode: status,
        message:
          exceptionResponse instanceof String
            ? exceptionResponse
            : exception.message,
        errors:
          exceptionResponse instanceof String ||
          exceptionResponse['errors'] == undefined
            ? {}
            : exceptionResponse['errors'],
        stack:
          (appConfig() as AppConfig).nodeEnv === EnvironmentEnum.Development
            ? exception.stack
            : undefined,
      });
    } else {
      this.logger.error(exception);
      LoggerFacade('error').error(
        `Request ${JSON.stringify(request)} Exception ${JSON.stringify(
          exception
        )}`
      );
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        errors: {},
        stack:
          (appConfig() as AppConfig).nodeEnv === EnvironmentEnum.Development
            ? exception.stack
            : undefined,
      });
    }
  }
}
