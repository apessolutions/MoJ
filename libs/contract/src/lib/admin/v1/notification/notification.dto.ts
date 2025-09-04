/* eslint-disable @nx/enforce-module-boundaries */
import { NullableType } from '@./common/types/nullable.type';
import { Notification } from '@./notifications/domain/notification';
import { EventEnum } from '@./notifications/enums/event-type.enum';

export class NotificationDto {
  id!: number;
  title!: string;
  body!: string;
  event!: EventEnum;
  isRead!: boolean;
  image?: NullableType<string>;
  additional?: NullableType<JSON>;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.title = notification.title;
    this.body = notification.body;
    this.event = notification.event;
    this.isRead = notification.isRead;
    this.image = notification.image;
    this.additional = notification.additional;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}
