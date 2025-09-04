import { Injectable } from '@nestjs/common';

import { Campaign } from '@./campaigns/domain/campaign';
import { CampaignDto } from '@./contract';

@Injectable()
export class CampaignTransformer {
  mapToDto(campaign: Campaign) {
    return new CampaignDto(campaign);
  }

  mapArrToDto(campaigns: Campaign[]) {
    return campaigns.map((campaign) => this.mapToDto(campaign));
  }
}
