/* eslint-disable @nx/enforce-module-boundaries */
import { Admin } from '@./admin/domain/admin';
import { PermissionType } from '@./role/types/permission-type.type';

export class AdminInfoDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isSuper: boolean;
  status: boolean;
  permissions: PermissionType[] = [];
  role: string | undefined;
  constructor(admin: Admin) {
    this.id = admin.id;
    this.firstName = admin.firstName;
    this.lastName = admin.lastName;
    this.email = admin.email;
    this.status = admin.status;
    this.isSuper = admin.isSuper;
    if (admin.roles.length > 0) {
      const name: string[] = [];
      const permissionsSet = new Set<PermissionType>();
      admin.roles.forEach((role) => {
        name.push(role.title);
        role.permissions.forEach((permission) => {
          permissionsSet.add(permission);
        });
      });
      this.permissions = Array.from(permissionsSet);
      this.role = name.join(', ');
    }
  }
}
