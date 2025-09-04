import { Injectable } from '@nestjs/common';

import { NotificationDto } from '@./contract';
import { Notification } from '@./notifications/domain/notification';

@Injectable()
export class NotificationTransformer {
  mapToDto(notification: Notification) {
    return new NotificationDto(notification);
  }

  mapArrToDto(notifications: Notification[]) {
    return notifications.map((notification) => this.mapToDto(notification));
  }
}
