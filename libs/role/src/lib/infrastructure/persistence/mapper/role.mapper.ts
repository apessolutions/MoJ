import { Role } from '../../../domain/role';
import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const role = new Role();
    role.id = raw.id;
    role.title = raw.title;
    role.description = raw.description;
    role.permissions = raw.permissions;
    role.createdAt = raw.createdAt;
    role.updatedAt = raw.updatedAt;
    return role;
  }

  static toPersistence(role: Role): RoleEntity {
    const roleEntity = new RoleEntity();
    roleEntity.id = role.id;
    roleEntity.title = role.title;
    roleEntity.description = role.description;
    roleEntity.permissions = role.permissions;
    return roleEntity;
  }
}
