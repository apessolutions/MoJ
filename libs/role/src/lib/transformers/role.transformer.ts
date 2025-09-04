import { Injectable } from '@nestjs/common';
import { Role } from '../domain';
import { RoleDto } from '@./contract';

@Injectable()
export class RoleTransformer {
  mapToDto(role: Role) {
    return new RoleDto(role);
  }

  mapArrToDto(roles: Role[]) {
    return roles.map((role) => this.mapToDto(role));
  }
}
