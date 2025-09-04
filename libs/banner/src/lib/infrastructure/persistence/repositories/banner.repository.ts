/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  BannerRepository,
  IBannerFindOptions,
} from '../../../application/ports/banner.repository';
import { Banner } from '../../../domain/banner';
import { BannerEntity } from '../entities/banner.entity';
import { BannerMapper } from '../mapper/banner.mapper';
import { BannerQueryBuilder } from '../utils/banner-query.builder';

import { NullableType } from '@./common/types/nullable.type';

@Injectable()
export class BannerRelationalRepository implements BannerRepository {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannersRepository: Repository<BannerEntity>
  ) {}

  @Transactional()
  async incrementBannersOrder(
    start: Banner['order'],
    end: Banner['order'],
    startEquality = true,
    endEquality = true
  ) {
    const startCondition = startEquality
      ? '"order" >= :start'
      : '"order" > :start';
    const endCondition = endEquality ? '"order" <= :end' : '"order" < :end';

    const query = this.bannersRepository
      .createQueryBuilder()
      .update(BannerEntity)
      .set({ order: () => '"order" + 1' })
      .where(`${startCondition} and ${endCondition}`, { start, end });

    await query.execute();
  }

  @Transactional()
  async decrementBannersOrder(
    start: Banner['order'],
    end: Banner['order'],
    startEquality = true,
    endEquality = true
  ) {
    const startCondition = startEquality
      ? '"order" >= :start'
      : '"order" > :start';
    const endCondition = endEquality ? '"order" <= :end' : '"order" < :end';

    const query = this.bannersRepository
      .createQueryBuilder()
      .update(BannerEntity)
      .set({ order: () => '"order" - 1' })
      .where(`${startCondition} and ${endCondition}`, { start, end });

    await query.execute();
  }

  @Transactional()
  async create(
    data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'category'>
  ): Promise<Banner> {
    const newEntity = await this.bannersRepository.save(
      this.bannersRepository.create(data)
    );
    return BannerMapper.toDomain(newEntity);
  }

  async findManyWithPagination(
    options: IBannerFindOptions
  ): Promise<Readonly<{ data: Banner[]; count: number }>> {
    const queryBuilder = new BannerQueryBuilder(this.bannersRepository);
    queryBuilder
      .configQuery(options.config)
      .filter(options.filters)
      .sort(options.sort);
    const [entities, count] = await queryBuilder.query.getManyAndCount();
    return {
      data: entities.map(BannerMapper.toDomain),
      count,
    };
  }

  async findOne(options: IBannerFindOptions): Promise<NullableType<Banner>> {
    const queryBuilder = new BannerQueryBuilder(this.bannersRepository);
    queryBuilder.filter(options.filters);
    const entity = await queryBuilder.query.getOne();
    return entity ? BannerMapper.toDomain(entity) : null;
  }

  async findLastOrderBanner(): Promise<NullableType<Banner>> {
    const lastOrderBanner = await this.bannersRepository.findOne({
      where: {},
      order: {
        order: 'DESC',
      },
    });
    return lastOrderBanner ? BannerMapper.toDomain(lastOrderBanner) : null;
  }

  @Transactional()
  async update(banner: Banner): Promise<Banner> {
    const bannerEntity = await this.bannersRepository.save(
      BannerMapper.toPersistence(banner)
    );
    return BannerMapper.toDomain(bannerEntity);
  }

  @Transactional()
  async softDelete(id: Banner['id']): Promise<void> {
    const banner = await this.bannersRepository.findOne({ where: { id } });

    if (!banner) {
      return;
    }

    await this.bannersRepository.softRemove(banner);
  }

  @Transactional()
  async find(options: IBannerFindOptions): Promise<Banner[]> {
    const queryBuilder = new BannerQueryBuilder(this.bannersRepository);
    queryBuilder.filter(options.filters).sort({ order: 'ASC' });
    const banners = await queryBuilder.query.getMany();
    return banners.map(BannerMapper.toDomain);
  }

  @Transactional()
  async reorder(banners: number[]): Promise<void> {
    const query = this.bannersRepository
      .createQueryBuilder()
      .update(BannerEntity)
      .set({ order: () => 'ARRAY_POSITION(:banners, id)' })
      .where('id = ANY(:banners)', { banners });

    await query.execute();
  }
}
