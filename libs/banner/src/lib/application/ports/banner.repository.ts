/* eslint-disable @nx/enforce-module-boundaries */
import { Banner } from '../../domain/banner';

import { NullableType } from '@./common/types/nullable.type';
import { IPaginationResult } from '@./common/types/pagination-result';

export interface IBannerFindOptions {
  filters?: {
    id?: number;
    order?: number;
    onlyActive?: boolean;
    from?: Date;
    to?: Date;
  };
  sort?: object;
  config?: {
    skip?: number;
    take?: number;
  };
}

export abstract class BannerRepository {
  abstract create(
    data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'category'>
  ): Promise<Banner>;
  abstract findManyWithPagination(
    options: IBannerFindOptions
  ): Promise<IPaginationResult<Banner>>;
  abstract findOne(options: IBannerFindOptions): Promise<NullableType<Banner>>;
  abstract find(options?: IBannerFindOptions): Promise<Banner[]>;
  abstract findLastOrderBanner(): Promise<NullableType<Banner>>;
  abstract update(banner: Banner): Promise<Banner>;
  abstract softDelete(id: Banner['id']): Promise<void>;
  abstract incrementBannersOrder(
    startOrder: Banner['order'],
    endOrder: Banner['order'],
    startEquality?: boolean,
    endEquality?: boolean
  ): Promise<void>;
  abstract decrementBannersOrder(
    startOrder: Banner['order'],
    endOrder: Banner['order'],
    startEquality?: boolean,
    endEquality?: boolean
  ): Promise<void>;
  abstract reorder(banners: number[]): Promise<void>;
}
