import { Column, Entity, Index, ManyToMany } from 'typeorm';

import { PermissionType } from '../../../types/permission-type.type';

import { AdminEntity } from '../../../../../../admin/src/lib/infrastructure/persistence/entities/admin.entity';
import { EntityHelper } from '../../../../../../common/src/lib/entities/entity-helper';
import { MaybeType } from '../../../../../../common/src/lib/types/maybe.type';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityHelper {
  @Column({ type: 'varchar' })
  @Index({ unique: true })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', array: true })
  permissions!: PermissionType[];

  @ManyToMany(() => AdminEntity, (admin) => admin.roles, {
    onDelete: 'CASCADE',
  })
  admins: MaybeType<AdminEntity[]>;
}
