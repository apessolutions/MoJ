import { Campaign } from '../../domain/campaign';
import { IPaginationResult } from '@./common/types/pagination-result';

import { NullableType } from '../../../../../common/src/lib/types/nullable.type';

export interface ICampaignFindOptions {
  filters?: {
    id?: number;
  };
  sort?: object;
  config?: {
    skip?: number;
    take?: number;
  };
}

export abstract class CampaignRepository {
  abstract create(
    data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'category'>
  ): Promise<Campaign>;
  abstract findManyWithPagination(
    options: ICampaignFindOptions
  ): Promise<IPaginationResult<Campaign>>;
  abstract findOne(id: number): Promise<NullableType<Campaign>>;
  abstract update(banner: Campaign): Promise<Campaign>;
  abstract softDelete(id: Campaign['id']): Promise<void>;
}
