import { Column, Entity } from 'typeorm';

import { EntityHelper } from '@./common/entities/entity-helper';
import { NullableType } from '@./common/types/nullable.type';

@Entity({
  name: 'phone_number',
})
export class PhoneNumberEntity extends EntityHelper {
  @Column({ type: 'varchar', unique: true })
  phoneNumber!: string;

  @Column({ type: 'varchar' })
  verificationCode!: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  codeCreatedAt!: NullableType<Date>;
}
