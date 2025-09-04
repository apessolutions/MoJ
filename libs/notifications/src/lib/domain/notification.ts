import { Exclude } from 'class-transformer';
import { NullableType } from '../../../../common/src/lib/types/nullable.type';
import { EventEnum } from '../enums/event-type.enum';

export class Notification {
  id!: number;
  title!: string;
  body!: string;
  event!: EventEnum;
  isRead!: boolean;
  image?: NullableType<string>;
  additional?: NullableType<JSON>;
  createdAt!: Date;
  updatedAt!: Date;
  @Exclude()
  userId!: number;
}
