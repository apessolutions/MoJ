import { isDefined } from 'class-validator';
import { isNil } from 'lodash';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { ICampaignFindOptions } from '../../../application/ports/campaigns.repository';
import { CampaignEntity } from '../entities/campaign.entity';

export class CampaignQueryBuilder {
  public query!: SelectQueryBuilder<CampaignEntity>;
  constructor(repo: Repository<CampaignEntity>) {
    this.query = repo.createQueryBuilder('banners');
  }

  filter(filter: ICampaignFindOptions['filters']) {
    if (isNil(filter)) return this;

    if (isDefined(filter.id)) {
      this.query.andWhere('banners.id = :bannerId', {
        bannerId: filter.id,
      });
    }

    return this;
  }

  configQuery(config: ICampaignFindOptions['config']) {
    if (isNil(config)) return this;

    if (isDefined(config.skip)) {
      this.query.skip(config.skip);
    }

    if (isDefined(config.take)) {
      this.query.take(config.take);
    }
    return this;
  }
}
