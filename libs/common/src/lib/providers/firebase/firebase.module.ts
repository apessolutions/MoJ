import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import firebaseConfig from './config/firebase.config';
import { FirebaseNotificationService } from './services/firebase-notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [firebaseConfig],
    }),
  ],
  providers: [FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class FirebaseModule {}
