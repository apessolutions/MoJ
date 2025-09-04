import { Controller, applyDecorators } from '@nestjs/common';

export function ControllerDecorator(version: string, route: string) {
  return applyDecorators(Controller(`${version}/${route}`));
}
