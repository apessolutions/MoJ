import { Injectable } from '@nestjs/common';

import { PageOptionsDto } from '@./contract';
import { NotificationRepository } from '@./notifications/application/ports/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}
  async getAll(userId: number, options: PageOptionsDto) {
    return this.notificationRepository.findManyWithPagination({
      filters: { userId },
      config: options,
    });
  }
}
