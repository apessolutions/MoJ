import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function AdminControllerDecorator(version: string, route: string) {
  return applyDecorators(Controller(`${version}/admin/${route}`));
}

export function AdminTags(module: string) {
  return applyDecorators(ApiTags(`Admins ${module}`));
}
