import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserAddressRepository } from '../../../application/ports/user-address.repository';
import { UserAddress } from '../../../domain/user-address';
import { UserAddressEntity } from '../entities/user-address.entity';
import { UserAddressMapper } from '../mappers/user-address.mapper';

import { NullableType } from '@./common/types/nullable.type';

// import { NullableType } from '@./common';

@Injectable()
export class UserAddressRelationalRepository implements UserAddressRepository {
  constructor(
    @InjectRepository(UserAddressEntity)
    private readonly repository: Repository<UserAddressEntity>
  ) {}

  async update(data: UserAddress): Promise<UserAddress> {
    await this.repository.save(UserAddressMapper.toPersistence(data));
    return data;
  }

  async findUserAddress(userId: number): Promise<NullableType<UserAddress>> {
    const entity = await this.repository.findOne({
      where: {
        userId,
      },
    });
    return entity ? UserAddressMapper.toDomain(entity) : null;
  }

  async findGuestAddress(deviceId: string): Promise<NullableType<UserAddress>> {
    const entity = await this.repository.findOne({
      where: {
        deviceId,
      },
    });
    return entity ? UserAddressMapper.toDomain(entity) : null;
  }

  async create(data: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    const entity = await this.repository.save(this.repository.create(data));
    return UserAddressMapper.toDomain(entity);
  }
}
