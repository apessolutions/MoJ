/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
import { Repository } from 'typeorm';

import { UserRepository } from '../../../application/ports/user.repository';
import { User } from '../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

import { Campaign } from '@./campaigns/domain/campaign';
import { buildQuery } from '@./common/query/build-query.utils';
import { NullableType } from '@./common/types/nullable.type';
import { IPaginationResult } from '@./common/types/pagination-result';
import {
  ExtendedFindConfig,
  FindConfig,
  IFindOptions,
} from '@./common/types/query.type';

@Injectable()
export class UserRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findMany(options: IFindOptions<User>): Promise<User[]> {
    const query = buildQuery(options, {
      order: {
        id: 'DESC',
      },
    } as FindConfig<UserEntity>);
    const users = await this.userRepository.find(query);
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<User>;
    config: FindConfig<User>;
  }): Promise<IPaginationResult<User>> {
    const query = buildQuery(filters, config) as ExtendedFindConfig<UserEntity>;
    const [entities, count] = await this.userRepository.findAndCount(query);

    return {
      count,
      data: entities.map((user) => UserMapper.toDomain(user)),
    };
  }

  async create(data: Omit<User, 'id' | 'photo' | 'deletedAt'>): Promise<User> {
    const newEntity = await this.userRepository.save(
      this.userRepository.create(data)
    );
    return UserMapper.toDomain(newEntity);
  }

  async findOne(
    fields: IFindOptions<User>,
    config: FindConfig<User> = {}
  ): Promise<NullableType<User>> {
    const query = buildQuery(fields, config);
    const entity = await this.userRepository.findOne(query);
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(user: User): Promise<User> {
    await this.userRepository.save(UserMapper.toPersistence(user));
    return user;
  }

  async softDelete(id: User['id']): Promise<void> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.softRemove(user);
  }

  async restore(id: User['id']): Promise<void> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      withDeleted: true,
    });
    await this.userRepository.recover(user);
  }

  async findForCampaign(campaign: Campaign): Promise<User[]> {
    const { maxAge, minAge, gender } = campaign;

    const query = this.userRepository.createQueryBuilder('user');

    if (isDefined(maxAge)) {
      query.andWhere(`DATE_PART('YEAR', user.date_of_birth) <= :year`, {
        year: new Date().getFullYear() - maxAge,
      });
    }

    if (isDefined(minAge)) {
      query.andWhere(`DATE_PART('YEAR', user.date_of_birth) >= :year`, {
        year: new Date().getFullYear() - minAge,
      });
    }

    if (isDefined(gender) && gender.length > 0) {
      query.andWhere('user.gender IN (:...gender)', { gender });
    }

    const users = await query.getMany();
    return users.map((user) => UserMapper.toDomain(user));
  }
}
