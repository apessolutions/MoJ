/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserDeviceRepository } from '../../../application/ports/user-device.repository';
import { UserDevice } from '../../../domain/user-device';
import { UserDeviceEntity } from '../entities/user-device.entity';
import { UserDeviceMapper } from '../mappers/user-device.mapper';

import { buildQuery } from '@./common/query/build-query.utils';
import { FindConfig, IFindOptions } from '@./common/types/query.type';

@Injectable()
export class UserDeviceRelationalRepository implements UserDeviceRepository {
  constructor(
    @InjectRepository(UserDeviceEntity)
    private readonly userDeviceRepository: Repository<UserDeviceEntity>
  ) {}
  async create(data: Omit<UserDevice, 'id'>): Promise<UserDevice> {
    const entity = await this.userDeviceRepository.save(
      this.userDeviceRepository.create(data)
    );
    return UserDeviceMapper.toDomain(entity);
  }

  async find({
    fields,
    options,
  }: {
    fields: IFindOptions<UserDevice>;
    options?: FindConfig<UserDevice>;
  }): Promise<UserDevice[]> {
    const query = buildQuery(fields, options);
    const entities = await this.userDeviceRepository.find(query);
    return entities.map((entity) => UserDeviceMapper.toDomain(entity));
  }

  async delete(filters: IFindOptions<UserDevice>): Promise<void> {
    const query = buildQuery(filters, {});
    const devices = await this.userDeviceRepository.find(query);
    await this.userDeviceRepository.remove(devices);
  }
}
