import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PhoneNumberRepository } from '../../../application/ports/phone-number.repository';
import { PhoneNumber } from '../../../domain/phone-number';
import { PhoneNumberEntity } from '../entities/phone-number.entity';
import { PhoneNumberMapper } from '../mappers/phone-number.mapper';

import { buildQuery } from '@./common/query/build-query.utils';
import { NullableType } from '@./common/types/nullable.type';
import { ExtendedFindConfig, IFindOptions } from '@./common/types/query.type';

// import {
//   buildQuery,
//   ExtendedFindConfig,
//   IFindOptions,
//   NullableType,
// } from '@./common';

@Injectable()
export class PhoneNumberRelationalRepository implements PhoneNumberRepository {
  constructor(
    @InjectRepository(PhoneNumberEntity)
    private readonly repository: Repository<PhoneNumberEntity>
  ) {}

  async delete(filter: IFindOptions<PhoneNumber>): Promise<void> {
    const query: ExtendedFindConfig<PhoneNumberEntity> = buildQuery(filter);
    const p = await this.repository.findOneOrFail(query);
    await this.repository.remove(p);
  }

  async create(phoneNumber: string, code: string): Promise<PhoneNumber> {
    const entity = await this.repository.save(
      this.repository.create({
        phoneNumber,
        codeCreatedAt: new Date(Date.now()),
        verificationCode: code,
      })
    );
    return PhoneNumberMapper.toDomain(entity);
  }

  async update(phoneNumber: PhoneNumber): Promise<PhoneNumber> {
    await this.repository.save(PhoneNumberMapper.toPersistence(phoneNumber));
    return phoneNumber;
  }

  async findOne(
    filter: IFindOptions<PhoneNumber>
  ): Promise<NullableType<PhoneNumber>> {
    const query = buildQuery(filter);
    const entity = await this.repository.findOne(query);
    return entity ? PhoneNumberMapper.toDomain(entity) : null;
  }
}
