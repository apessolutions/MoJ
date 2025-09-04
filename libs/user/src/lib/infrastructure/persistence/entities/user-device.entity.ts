import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from './user.entity';

import { EntityHelper } from '@./common/entities/entity-helper';
import { DeviceEnum } from '@./common/enums/device.enum';
// import { DeviceEnum, EntityHelper } from '@./common';

@Entity({
  name: 'user_device',
})
export class UserDeviceEntity extends EntityHelper {
  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user!: UserEntity;

  @Column({ type: 'varchar', unique: true })
  deviceId!: string;

  @Column({ type: 'varchar', nullable: true })
  deviceType!: DeviceEnum;

  @Column({ type: 'varchar', unique: true })
  fcmToken!: string;
}
