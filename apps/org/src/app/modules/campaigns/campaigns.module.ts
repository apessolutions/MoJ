import { Module } from '@nestjs/common';

import { CampaignsController } from './controllers/v1/campaigns.controller';
import { CampaignTransformerModule } from './transformers/campaigns-transformer.module';

import { CampaignsModule as RootCampaignsModule } from '@./campaigns/campaigns.module';

@Module({
  imports: [RootCampaignsModule, CampaignTransformerModule],
  controllers: [CampaignsController],
  providers: [],
  exports: [CampaignTransformerModule],
})
export class CampaignsModule {}
