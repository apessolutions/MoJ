import { Module } from '@nestjs/common';

import { V1NotificationControllers } from './controllers/v1';
import { NotificationService } from './services/notifications.service';
import { NotificationTransformerModule } from './transformers/notifications-transformer.module';

import { NotificationsModule as RootNotificationsModule } from '@./notifications/notifications.module';

@Module({
  imports: [RootNotificationsModule, NotificationTransformerModule],
  controllers: [V1NotificationControllers],
  providers: [NotificationService],
  exports: [NotificationTransformerModule, NotificationService],
})
export class NotificationsModule {}
