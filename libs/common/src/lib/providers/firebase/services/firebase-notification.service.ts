import { Injectable } from '@nestjs/common';

import { IFirebaseNotification } from '../interfaces/firebase-notification.interface';
import { getFirebaseInstance } from '../utils/get-firebase-instance.util';

@Injectable()
export class FirebaseNotificationService {
  private readonly admin = getFirebaseInstance();

  async sendNotification(firebaseNotificationDto: IFirebaseNotification) {
    const { deviceTokens, message, title, additionalData } =
      firebaseNotificationDto;
    try {
      if (deviceTokens.length == 0) return;
      deviceTokens.forEach((token) => {
        this.admin.messaging().send({
          token: token,
          notification: { body: message, title },
          android: { priority: 'high' },
          data: additionalData
            ? JSON.parse(JSON.stringify(additionalData))
            : undefined,
        });
      });
    } catch (err) {
      console.log('Error in firebase ', err);
    }
  }
}
