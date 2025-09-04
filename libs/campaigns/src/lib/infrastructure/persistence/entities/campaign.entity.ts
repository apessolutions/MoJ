/* eslint-disable @nx/enforce-module-boundaries */
import { Column, Entity } from 'typeorm';

import { EntityHelper } from '@./common/entities/entity-helper';
import { GenderEnum } from '@./common/enums/gender.enum';

@Entity({
  name: 'campaign',
})
export class CampaignEntity extends EntityHelper {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  message!: string;

  @Column({ type: 'int', nullable: true })
  minAge!: number | null;

  @Column({ type: 'int', nullable: true })
  maxAge!: number | null;

  @Column('jsonb', { nullable: true, default: [] })
  gender!: GenderEnum[];
}
