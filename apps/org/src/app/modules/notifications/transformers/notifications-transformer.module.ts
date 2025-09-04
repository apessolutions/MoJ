import { Module } from '@nestjs/common';

import { NotificationTransformer } from './notifications.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationTransformer],
  exports: [NotificationTransformer],
})
export class NotificationTransformerModule {}
