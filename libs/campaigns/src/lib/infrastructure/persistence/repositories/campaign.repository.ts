/* eslint-disable @nx/enforce-module-boundaries */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CodeRepository } from '../../../application/ports/campaigns.repository';
// import { CodeEntity } from '../entities/campaign.entity';
// import { CodeMapper } from '../mappers/campaign.mapper';
// import { Transactional } from 'typeorm-transactional';
// import { Code } from '@./code/domain/code';
// import { FindConfig, IFindOptions } from '@./common/types/query.type';
// import { NullableType } from '@./common/types/nullable.type';
// import { buildQuery } from '../../../../../../common/src/lib/query/build-query.utils';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
  CampaignRepository,
  ICampaignFindOptions,
} from '../../../application/ports/campaigns.repository';
import { Campaign } from '../../../domain/campaign';
import { CampaignEntity } from '../entities/campaign.entity';
import { CampaignMapper } from '../mappers/campaign.mapper';
import { CampaignQueryBuilder } from '../utils/campaigns-query.builder';

import { NullableType } from '@./common/types/nullable.type';
import { IPaginationResult } from '@./common/types/pagination-result';

@Injectable()
export class CampaignRelationalRepository implements CampaignRepository {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly repository: Repository<CampaignEntity>
  ) {}

  @Transactional()
  async create(data: Campaign): Promise<Campaign> {
    const newEntity = await this.repository.save(
      CampaignMapper.toPersistence(data)
    );
    return CampaignMapper.toDomain(newEntity);
  }

  @Transactional()
  async findManyWithPagination(
    options: ICampaignFindOptions
  ): Promise<IPaginationResult<Campaign>> {
    const queryBuilder = new CampaignQueryBuilder(this.repository);
    queryBuilder.configQuery(options.config).filter(options.filters);

    const [entities, count] = await queryBuilder.query.getManyAndCount();
    return {
      data: entities.map(CampaignMapper.toDomain),
      count,
    };
  }

  @Transactional()
  async findOne(id: number): Promise<NullableType<Campaign>> {
    const campaign = await this.repository.findOne({ where: { id } });
    return campaign ? CampaignMapper.toDomain(campaign) : null;
  }

  @Transactional()
  async softDelete(id: Campaign['id']): Promise<void> {
    await this.repository.softDelete(id);
  }

  @Transactional()
  async update(campaign: Campaign): Promise<Campaign> {
    const campaignEntity = await this.repository.save(
      CampaignMapper.toPersistence(campaign)
    );
    return CampaignMapper.toDomain(campaignEntity);
  }
}
