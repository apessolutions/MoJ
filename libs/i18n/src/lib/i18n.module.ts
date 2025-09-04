import { Module } from '@nestjs/common';
import { HeaderResolver, I18nModule as TModule } from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/src/lib/app-config.type';
import * as path from 'path';
import appConfig from '@./config/app.config';

@Module({
  imports: [
    TModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig>) => ({
        fallbackLanguage: (appConfig() as AppConfig).fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, 'libs/i18n/src/lib'),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: () => {
            return [(appConfig() as AppConfig).headerLanguage];
          },
          inject: [],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class I18nModule {}
