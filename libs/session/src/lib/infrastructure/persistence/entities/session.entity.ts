import { Column, Entity, Index } from 'typeorm';

import { EntityHelper } from 'libs/common/src/lib/entities/entity-helper';
import { UserTypeEnum } from 'libs/common/src/lib/enums/user-type.enum';

@Entity({
  name: 'session',
})
export class SessionEntity extends EntityHelper {
  @Index('IDX_SESSION_USER_ID')
  @Column({ type: 'int' })
  userId!: number;

  @Index('IDX_SESSION_USER_TYPE')
  @Column({ type: 'enum', enum: UserTypeEnum })
  userType!: UserTypeEnum;

  @Column({ type: 'timestamp with time zone' })
  expiresAt!: Date;
}
