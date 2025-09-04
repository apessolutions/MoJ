import { RoleMapper } from '@./role/infrastructure/persistence/mapper/role.mapper';

import { Admin } from '../../../domain/admin';
import { AdminEntity } from '../entities/admin.entity';

export class AdminMapper {
  static toDomain(entity: AdminEntity): Admin {
    const domain = new Admin();
    domain.id = entity.id;
    domain.email = entity.email;
    domain.firstName = entity.firstName;
    domain.lastName = entity.lastName;
    domain.password = entity.password;
    domain.isSuper = entity.isSuper;
    domain.status = entity.status;
    domain.roles = entity.roles ? entity.roles.map(RoleMapper.toDomain) : [];
    return domain;
  }

  static toPersistence(admin: Admin): AdminEntity {
    const entity = new AdminEntity();
    entity.id = admin.id;
    entity.email = admin.email;
    entity.firstName = admin.firstName;
    entity.lastName = admin.lastName;
    entity.password = admin.password;
    entity.isSuper = admin.isSuper;
    entity.status = admin.status;
    entity.roles = admin.roles.map((role) => RoleMapper.toPersistence(role));
    return entity;
  }
}
