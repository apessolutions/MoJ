/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Campaign } from '../../../domain/campaign';
import { CampaignEntity } from '../entities/campaign.entity';

export class CampaignMapper {
  static toDomain(raw: CampaignEntity): Campaign {
    const campaign = new Campaign();
    campaign.id = raw.id;
    campaign.title = raw.title;
    campaign.message = raw.message;
    campaign.minAge = raw.minAge;
    campaign.maxAge = raw.maxAge;
    campaign.gender = raw.gender;
    campaign.createdAt = raw.createdAt;
    campaign.updatedAt = raw.updatedAt;
    return campaign;
  }

  static toPersistence(campaign: Campaign): CampaignEntity {
    const entity = new CampaignEntity();
    entity.id = campaign.id;
    entity.title = campaign.title;
    entity.message = campaign.message;
    entity.minAge = campaign.minAge;
    entity.maxAge = campaign.maxAge;
    entity.gender = campaign.gender;
    entity.createdAt = campaign.createdAt!;
    entity.updatedAt = campaign.updatedAt!;
    return entity;
  }
}
