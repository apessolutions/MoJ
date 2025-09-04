import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '../entities/admin.entity';

import { AdminMapper } from '../mapper/admin.mapper';
import { AdminRepository } from '../../../application/ports/admin.repository';

import { Transactional } from 'typeorm-transactional';
import {
  ExtendedFindConfig,
  FindConfig,
  IFindOptions,
} from '@./common/types/query.type';
import { Admin } from '@./admin/domain/admin';
import { buildQuery } from '../../../../../../common/src/lib/query/build-query.utils';
import { RoleMapper } from '@./role/infrastructure/persistence/mapper/role.mapper';
import { IPaginationResult } from '@./common/types/pagination-result';
import { NullableType } from '@./common/types/nullable.type';

@Injectable()
export class AdminRelationalRepository implements AdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminsRepository: Repository<AdminEntity>
  ) {}

  async findMany(options: IFindOptions<Admin>): Promise<Admin[]> {
    const query = buildQuery(options, {
      order: {
        id: 'DESC',
      },
    } as FindConfig<AdminEntity>);
    const admins = await this.adminsRepository.find(query);
    return admins.map((admin) => AdminMapper.toDomain(admin));
  }

  @Transactional()
  async create(data: Omit<Admin, 'id'>): Promise<Admin> {
    const newEntity = await this.adminsRepository.save(
      this.adminsRepository.create({
        ...data,
        roles: data.roles.map((role) => RoleMapper.toPersistence(role)),
      })
    );
    return AdminMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<Admin>;
    config: FindConfig<Admin>;
  }): Promise<IPaginationResult<Admin>> {
    const query = buildQuery(
      filters,
      config
    ) as ExtendedFindConfig<AdminEntity>;
    const [entities, count] = await this.adminsRepository.findAndCount(query);

    return {
      count,
      data: entities.map((admin) => AdminMapper.toDomain(admin)),
    };
  }

  async findOne(fields: IFindOptions<Admin>): Promise<NullableType<Admin>> {
    const entity = await this.adminsRepository.findOne({
      where: fields as IFindOptions<AdminEntity>,
    });
    return entity ? AdminMapper.toDomain(entity) : null;
  }

  @Transactional()
  async update(admin: Admin): Promise<Admin> {
    const adminEntity = await this.adminsRepository.findOneByOrFail({
      id: admin.id,
    });
    const newAdminEntity = AdminMapper.toPersistence(admin);
    newAdminEntity.previousPassword = adminEntity.password;
    const updatedEntity = await this.adminsRepository.save(newAdminEntity);

    return AdminMapper.toDomain(updatedEntity);
  }

  @Transactional()
  async softDelete(id: Admin['id']): Promise<void> {
    const admin = await this.adminsRepository.findOne({ where: { id } });
    if (!admin) {
      return;
    }
    await this.adminsRepository.softRemove(admin);
  }

  @Transactional()
  async delete(id: Admin['id']): Promise<void> {
    const admin = await this.adminsRepository.findOne({ where: { id } });
    if (!admin) {
      return;
    }
    await this.adminsRepository.remove(admin);
  }
}
