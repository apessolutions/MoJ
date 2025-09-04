import { Module } from '@nestjs/common';

import { CampaignTransformer } from './campaigns.transformer';

@Module({
  imports: [],
  controllers: [],
  providers: [CampaignTransformer],
  exports: [CampaignTransformer],
})
export class CampaignTransformerModule {}
