/* eslint-disable @nx/enforce-module-boundaries */
import { User } from '../../domain/user';

import { Campaign } from '@./campaigns/domain/campaign';
import { NullableType } from '@./common/types/nullable.type';
import { IPaginationResult } from '@./common/types/pagination-result';
import { FindConfig, IFindOptions } from '@./common/types/query.type';

export interface IUserFindOptions {
  filters?: {
    text?: string;
    excludeUserId?: number;
  };
  config?: {
    take?: number;
    skip?: number;
  };
}

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'photo' | 'deletedAt'>
  ): Promise<User>;
  abstract findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<User>;
    config: FindConfig<User>;
  }): Promise<IPaginationResult<User>>;
  abstract findMany(filters: IFindOptions<User>): Promise<User[]>;
  abstract findOne(
    fields: IFindOptions<User>,
    config?: FindConfig<User>
  ): Promise<NullableType<User>>;
  abstract update(user: User): Promise<User>;
  abstract softDelete(id: User['id']): Promise<void>;
  abstract restore(id: User['id']): Promise<void>;
  abstract findForCampaign(campaign: Campaign): Promise<User[]>;
}
