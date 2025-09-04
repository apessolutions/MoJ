import { Module } from '@nestjs/common';

import { NotificationPersistenceModule } from './infrastructure/persistence/persistence.module';

import { UserModule } from '../../../user/src/lib/user.module';
import { FirebaseModule } from '../../../common/src/lib/providers/firebase/firebase.module';
import { NotificationService } from './application/services/notification.service';
import { NotificationProcessor } from './queue/notification.queue';

@Module({
  imports: [NotificationPersistenceModule, UserModule, FirebaseModule],
  providers: [NotificationService, NotificationProcessor],
  exports: [
    NotificationPersistenceModule,
    UserModule,
    FirebaseModule,
    NotificationService,
  ],
})
export class NotificationsModule {}
