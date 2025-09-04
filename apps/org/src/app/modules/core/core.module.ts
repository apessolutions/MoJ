import { Module } from '@nestjs/common';

import { V1CoreControllers } from './controllers/v1';
import { CoreService } from './service/core.service';

@Module({
  imports: [],
  controllers: [V1CoreControllers],
  providers: [CoreService],
})
export class CoreModule {}
