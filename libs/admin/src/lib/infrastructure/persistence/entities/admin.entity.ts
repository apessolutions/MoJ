import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import { EntityHelper } from '../../../../../../common/src/lib/entities/entity-helper';
import { MaybeType } from '../../../../../../common/src/lib/types/maybe.type';
import { NullableType } from '../../../../../../common/src/lib/types/nullable.type';
import { RoleEntity } from '../../../../../../role/src/lib/infrastructure/persistence/entities/role.entity';

@Entity({
  name: 'admin',
})
export class AdminEntity extends EntityHelper {
  @Index()
  @Column({ type: String })
  firstName!: string;

  @Index()
  @Column({ type: String })
  lastName!: string;

  @Index('IDX_ADMIN_EMAIL', { unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: String })
  email!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  fcmToken: MaybeType<string>;

  @Column({ type: 'bool', default: false })
  isSuper!: boolean;

  @Exclude({ toPlainOnly: true })
  public previousPassword!: string;

  @ManyToMany(() => RoleEntity, (role) => role.admins, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  roles?: NullableType<RoleEntity[]>;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
