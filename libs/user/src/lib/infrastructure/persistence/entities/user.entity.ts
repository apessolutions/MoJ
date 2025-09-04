import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { EntityHelper } from '@./common/entities/entity-helper';
import { GenderEnum } from '@./common/enums/gender.enum';
import { NullableType } from '@./common/types/nullable.type';
import { FileEntity } from '@./file/infrastructure/persistence/entities/file.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityHelper {
  @Column({ type: 'varchar', nullable: true })
  firstName?: NullableType<string>;

  @Column({ type: 'varchar', nullable: true })
  lastName?: NullableType<string>;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender?: NullableType<GenderEnum>;

  @Column({ type: 'varchar', nullable: true })
  email?: NullableType<string>;

  @Index({
    unique: true,
    where: 'user_name IS NOT NULL AND deleted_at IS NULL',
  })
  @Column({ nullable: true, type: 'varchar' })
  userName?: NullableType<string>;

  @Column({ type: 'int', nullable: true })
  photoId?: NullableType<number>;

  @OneToOne(() => FileEntity, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'photo_id' })
  photo?: NullableType<FileEntity>;

  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar' })
  phoneNumber!: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: NullableType<string>;

  @Column({ type: 'bool', default: true })
  status!: boolean;
}
