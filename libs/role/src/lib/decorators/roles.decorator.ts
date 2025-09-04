import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../types/permission-type.type';

export const PERMISSIONS_KEY = 'permission';

export function Roles(roles: PermissionType[]) {
  return SetMetadata(PERMISSIONS_KEY, roles || []);
}
