import { Injectable } from '@nestjs/common';

import { Notification } from '../../domain/notification';
import { NotificationRepository } from '../ports/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notificationRepository.create(data);
  }
}
