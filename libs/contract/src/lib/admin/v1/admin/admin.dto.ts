/* eslint-disable @nx/enforce-module-boundaries */
import { RoleDto } from '../role';

import { Admin } from '@./admin/domain/admin';

export class AdminDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  roles: RoleDto[] = [];
  email!: string;
  status!: boolean;
  isSuper!: boolean;
  role: string | undefined;
  constructor(admin: Admin) {
    this.id = admin.id;
    this.firstName = admin.firstName;
    this.lastName = admin.lastName;
    if (admin.roles) {
      const name: string[] = [];
      this.roles = admin.roles.map((role) => new RoleDto(role));
      admin.roles.forEach((role) => {
        name.push(role.title);
      });
      this.role = name.join(', ');
    }
    this.email = admin.email;
    this.status = admin.status;
    this.isSuper = admin.isSuper;
  }
}
