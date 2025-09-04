import { Column, Entity } from 'typeorm';

import { EventEnum } from '../../../enums/event-type.enum';

import { EntityHelper } from '@./common/entities/entity-helper';

@Entity({
  name: 'notification',
})
export class NotificationEntity extends EntityHelper {
  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ type: 'varchar', nullable: true })
  body!: string;

  @Column({ type: 'varchar', nullable: true })
  image!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  event!: EventEnum;

  @Column({ type: 'json', nullable: true })
  additional?: JSON;

  @Column({ type: 'integer' })
  userId!: number;
}
