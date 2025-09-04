/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';

// eslint-disable-next-line @nx/enforce-module-boundaries
import validationOptions from '../../../libs/common/src/lib/utils/validation-options.utils';

import { AppModule } from './app/app.module';

import appConfig from '@./config/app.config';
import { AppConfig } from '@./config/app-config.type';
import NestjsLoggerServiceAdapter from '@./logger/nestjs-adapter.service';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = app.get(NestjsLoggerServiceAdapter);
  app.useLogger(logger);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableVersioning();
  const port = (appConfig() as AppConfig).port;
  const globalPrefix = (appConfig() as AppConfig).apiPrefix;
  app.setGlobalPrefix(globalPrefix);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const config = new DocumentBuilder()
    .setTitle('Nestjs Boilerplate')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
