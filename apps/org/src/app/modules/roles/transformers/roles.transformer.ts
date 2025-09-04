import { Injectable } from '@nestjs/common';

import { RoleDto } from '@./contract';
import { Role } from '@./role/domain/role';

@Injectable()
export class RoleTransformer {
  mapToDto(role: Role) {
    return new RoleDto(role);
  }

  mapArrToDto(roles: Role[]) {
    return roles.map((role) => this.mapToDto(role));
  }
}
