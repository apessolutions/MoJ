import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignRepository } from '../../application/ports/campaigns.repository';

import { CampaignEntity } from './entities/campaign.entity';
import { CampaignRelationalRepository } from './repositories/campaign.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity])],
  providers: [
    {
      provide: CampaignRepository,
      useClass: CampaignRelationalRepository,
    },
  ],
  exports: [CampaignRepository],
})
export class CampaignPersistenceModule {}
