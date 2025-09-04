import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import {
  BannerInternalType,
  BannerType,
} from '../../../enums/banner-type.enum';

import { EntityHelper } from '@./common/entities/entity-helper';
import { FileEntity } from '@./file/infrastructure/persistence/entities/file.entity';

@Entity({
  name: 'banner',
})
export class BannerEntity extends EntityHelper {
  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  type!: BannerType;

  @Column({ type: 'varchar', nullable: true })
  internalType?: BannerInternalType;

  @Column({ type: 'varchar' })
  linkValue!: string;

  @Column({ type: 'int' })
  mediaId!: number;

  @ManyToOne(() => FileEntity, {
    persistence: false,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'media_id' })
  media!: FileEntity;

  @Column({ type: 'int' })
  order!: number;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'date', nullable: true })
  from?: Date;

  @Column({ type: 'date', nullable: true })
  to?: Date;
}
