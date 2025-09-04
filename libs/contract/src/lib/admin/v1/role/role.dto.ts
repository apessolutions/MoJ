import { MaybeType } from '@./common/types/maybe.type';
import { Role } from '@./role/domain/role';
import { PermissionType } from '@./role/types/permission-type.type';

export class RoleDto {
  id: number;
  title: string;
  description?: string;
  permissions!: PermissionType[];
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;

  constructor(role: Role) {
    this.id = role.id;
    this.title = role.title;
    this.description = role.description;
    this.permissions = role.permissions;
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}
