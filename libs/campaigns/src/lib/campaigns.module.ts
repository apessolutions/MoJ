import { Module } from '@nestjs/common';

import { CampaignService } from './application/services/campaigns.service';
import { CampaignPersistenceModule } from './infrastructure/persistence/persistence.module';

import { UserModule } from 'libs/user/src/lib/user.module';
import { BullModule } from '@nestjs/bull';
import { NOTIFICATION_QUEUE } from '@./common/constants/notification-queue.constants';

@Module({
  imports: [
    CampaignPersistenceModule,
    UserModule,
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  controllers: [],
  providers: [CampaignService],
  exports: [CampaignPersistenceModule, CampaignService],
})
export class CampaignsModule {}
