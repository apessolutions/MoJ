import { Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CoreService } from '../../service/core.service';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';

@ApiTags('Core')
@ControllerDecorator('v1', 'core')
export class CoreController {
  constructor(private readonly service: CoreService) {}

  @AdminAuth()
  @Get('permissions')
  @HttpCode(HttpStatus.OK)
  public getPermissions() {
    const data = this.service.getPermissions();
    return ResponseGenerator.generateResourceFormat(data);
  }
}
