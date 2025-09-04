import { isDefined } from 'class-validator';
import { isNil } from 'lodash';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { IBannerFindOptions } from '../../../application/ports/banner.repository';
import { BannerEntity } from '../entities/banner.entity';

export class BannerQueryBuilder {
  public query!: SelectQueryBuilder<BannerEntity>;
  constructor(repo: Repository<BannerEntity>) {
    this.query = repo
      .createQueryBuilder('banners')
      .leftJoinAndSelect('banners.media', 'media');
  }

  filter(filter: IBannerFindOptions['filters']) {
    if (isNil(filter)) return this;

    if (isDefined(filter.id)) {
      this.query.andWhere('banners.id = :bannerId', {
        bannerId: filter.id,
      });
    }
    if (isDefined(filter.from) && isDefined(filter.to)) {
      this.query
        .andWhere('banners.from <= :currentDate', { currentDate: filter.from })
        .andWhere('banners.to >= :currentDate', { currentDate: filter.to });
    }

    if (isDefined(filter.onlyActive) && filter.onlyActive) {
      this.query.andWhere(
        new Brackets((qb) => {
          qb.where('DATE(banners.from) IS NULL').orWhere(
            'DATE(banners.from) <= DATE(:currentDate)',
            {
              currentDate: new Date(),
            }
          );
        })
      );
      this.query.andWhere(
        new Brackets((qb) => {
          qb.where('DATE(banners.to) IS NULL').orWhere(
            'DATE(banners.to) >= DATE(:currentDate)',
            {
              currentDate: new Date(),
            }
          );
        })
      );
      this.query.andWhere('banners.status = true');
    }

    return this;
  }

  sort(sort: IBannerFindOptions['sort']) {
    this.query.orderBy('banners.order', 'ASC');
    return this;
  }

  configQuery(config: IBannerFindOptions['config']) {
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
