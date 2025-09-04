import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function MobileControllerDecorator(version: string, route: string) {
  return applyDecorators(Controller(`${version}/mobile/${route}`));
}

export function MobileTags(module: string) {
  return applyDecorators(ApiTags(`Mobile ${module}`));
}
