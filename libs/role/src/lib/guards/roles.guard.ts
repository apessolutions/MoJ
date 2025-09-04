import { ContextProvider } from '@./common/providers/context.provider';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '@./role/decorators/roles.decorator';
import { PermissionType } from '@./role/types/permission-type.type';
import { isDefined } from 'class-validator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) as PermissionType[];

    if (!isDefined(permissions) || permissions.length == 0) {
      return true;
    }

    const admin = ContextProvider.getAuthAdmin()!;

    if (admin.isSuper) {
      return true;
    }

    const adminPermissions = new Set(
      admin.roles.flatMap((role) => role.permissions)
    );

    const isAllowed = permissions.every((permission) =>
      adminPermissions.has(permission)
    );

    return isAllowed;
  }
}
