/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Notification } from '../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';

export class NotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    const campaign = new Notification();
    campaign.id = raw.id;
    campaign.title = raw.title;
    campaign.body = raw.body;
    campaign.image = raw.image;
    campaign.isRead = raw.isRead;
    campaign.additional = raw.additional;
    campaign.userId = raw.userId;
    campaign.event = raw.event;
    campaign.createdAt = raw.createdAt;
    campaign.updatedAt = raw.updatedAt;
    return campaign;
  }

  static toPersistence(campaign: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = campaign.id;
    entity.title = campaign.title;
    entity.body = campaign.body;
    entity.image = campaign.image!;
    entity.isRead = campaign.isRead;
    entity.additional = campaign.additional!;
    entity.userId = campaign.userId;
    entity.event = campaign.event;
    entity.createdAt = campaign.createdAt;
    entity.updatedAt = campaign.updatedAt;
    return entity;
  }
}
