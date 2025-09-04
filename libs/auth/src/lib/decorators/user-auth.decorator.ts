import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserAuthGuard } from '../guards/user.guard';

export function UserAuth(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  );
}
