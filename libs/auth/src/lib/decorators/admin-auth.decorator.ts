import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminAuthGuard } from '../guards/admin.guard';
import { Roles } from '../../../../role/src/lib/decorators/roles.decorator';
import { PermissionType } from '@./role/types/permission-type.type';
import { RolesGuard } from '../../../../role/src/lib/guards/roles.guard';

export function AdminAuth(roles: PermissionType[] = []): MethodDecorator {
  return applyDecorators(
    UseGuards(AdminAuthGuard),
    Roles(roles),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
