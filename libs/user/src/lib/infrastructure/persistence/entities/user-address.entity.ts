import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { UserEntity } from './user.entity';

import { EntityHelper } from '@./common/entities/entity-helper';
import { NullableType } from '@./common/types/nullable.type';

// import { EntityHelper, NullableType } from '@./common';

@Entity({
  name: 'user_address',
})
export class UserAddressEntity extends EntityHelper {
  @Column({ type: 'varchar', unique: true })
  deviceId!: string;

  @Column({ type: 'int', nullable: true })
  userId!: number;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: NullableType<UserEntity>;

  @Column({ type: 'float' })
  lat!: number;

  @Column({ type: 'float' })
  long!: number;
}
