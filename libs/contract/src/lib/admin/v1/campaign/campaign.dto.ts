import { GenderEnum } from '../../../../../../common/src/lib/enums/gender.enum';
import { Campaign } from '../../../../../../campaigns/src/lib/domain/campaign';
import { MaybeType } from '@./common/types/maybe.type';

export class CampaignDto {
  id!: number;
  title!: string;
  message!: string;
  minAge!: number | null;
  maxAge!: number | null;
  gender!: GenderEnum[];
  createdAt!: MaybeType<Date>;
  updatedAt!: MaybeType<Date>;

  constructor(campaign: Campaign) {
    this.id = campaign.id;
    this.title = campaign.title;
    this.message = campaign.message;
    this.minAge = campaign.minAge;
    this.maxAge = campaign.maxAge;
    this.gender = campaign.gender || [];
    this.createdAt = campaign.createdAt;
    this.updatedAt = campaign.updatedAt;
  }
}
