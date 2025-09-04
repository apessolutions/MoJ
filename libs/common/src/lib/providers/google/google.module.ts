import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './config/google.config';
import { GoogleMapsService } from './services/google-maps.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [googleConfig],
    }),
    HttpModule,
  ],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleModule {}
