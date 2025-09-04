import { Process, Processor } from '@nestjs/bull';

import {
  NOTIFICATION_QUEUE,
  USER_NOTIFICATION_PROCESS,
} from '../../../../common/src/lib/constants/notification-queue.constants';
import { Job } from 'bull';
import { Campaign } from '../../../../campaigns/src/lib/domain/campaign';
import { UserService } from '../../../../user/src/lib/application/services/user.service';
import { UserDeviceService } from '../../../../user/src/lib/application/services/user-device.service';
import { In } from 'typeorm';
import { NotificationService } from '../application/services/notification.service';
import { EventEnum } from '../enums/event-type.enum';
import { FirebaseNotificationService } from '../../../../common/src/lib/providers/firebase/services/firebase-notification.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor {
  constructor(
    private readonly userService: UserService,
    private readonly userDeviceService: UserDeviceService,
    private readonly notificationService: NotificationService,
    private readonly firebaseNotificationService: FirebaseNotificationService
  ) {}

  @Process(USER_NOTIFICATION_PROCESS)
  async sendCampaignNotification(job: Job<Campaign>) {
    const { data: campaign } = job;

    console.log('Sending campaign notification');

    const users = await this.userService.findForCampaign(campaign);

    const userDevices = await this.userDeviceService.find({
      fields: { userId: In(users.map((user) => user.id)) },
    });

    for (const device of userDevices) {
      const notification = await this.notificationService.create({
        title: campaign.title,
        body: campaign.message,
        userId: device.userId,
        event: EventEnum.CAMPAIGN,
      });

      // Send notification to device
      await this.firebaseNotificationService.sendNotification({
        deviceTokens: [device.fcmToken],
        title: notification.title,
        message: notification.body,
        additionalData: null,
      });
    }
  }
}
