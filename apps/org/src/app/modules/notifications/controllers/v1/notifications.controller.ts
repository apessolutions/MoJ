/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NotificationService } from '../../services/notifications.service';
import { NotificationTransformer } from '../../transformers/notifications.transformer';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { ContextProvider } from '@./common/providers/context.provider';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import { PageOptionsDto } from '@./contract';

@ApiTags('Notifications')
@ControllerDecorator('v1', 'notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationTransformer: NotificationTransformer
  ) {}

  @AdminAuth()
  @Get()
  @HttpCode(HttpStatus.CREATED)
  async getAll(@Query() query: PageOptionsDto) {
    const admin = ContextProvider.getAuthAdmin()!;
    const { count, data } = await this.notificationService.getAll(
      admin.id,
      query
    );
    return ResponseGenerator.generatePaginationFormat(
      this.notificationTransformer.mapArrToDto(data),
      count,
      query
    );
  }
}
