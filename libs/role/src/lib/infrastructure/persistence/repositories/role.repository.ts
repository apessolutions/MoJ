import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { RoleRepository } from '../../../application/ports/role.repository';
import { Role } from '../../../domain/role';
import { RoleEntity } from '../entities/role.entity';
import { RoleMapper } from '../mapper/role.mapper';

import { NullableType } from '@./common/types/nullable.type';
import { OmittedType } from '@./common/types/omitted.type';
import { IPaginationResult } from '@./common/types/pagination-result';
import {
  ExtendedFindConfig,
  FindConfig,
  IFindOptions,
} from '@./common/types/query.type';
import { buildQuery } from '../../../../../../common/src/lib/query/build-query.utils';

// import {
//   buildQuery,
//   ExtendedFindConfig,
//   FindConfig,
//   IFindOptions,
//   IPaginationResult,
//   NullableType,
//   OmittedType,
// } from '@./common';

@Injectable()
export class RoleRelationalRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>
  ) {}

  @Transactional()
  async create(data: OmittedType<Role>): Promise<Role> {
    const newEntity = await this.rolesRepository.save(
      this.rolesRepository.create({
        ...data,
      })
    );
    return RoleMapper.toDomain(newEntity);
  }

  async findMany(options: IFindOptions<Role>): Promise<Role[]> {
    const query = buildQuery(options, {
      order: {
        id: 'DESC',
      },
    } as FindConfig<Role>);
    const roleEntities: RoleEntity[] = await this.rolesRepository.find(query);
    return roleEntities.map((roleEntity) => RoleMapper.toDomain(roleEntity));
  }

  async findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<Role>;
    config: FindConfig<Role>;
  }): Promise<IPaginationResult<Role>> {
    const query = buildQuery(filters, config) as ExtendedFindConfig<RoleEntity>;
    const [entities, count] = await this.rolesRepository.findAndCount(query);

    return {
      count,
      data: entities.map(RoleMapper.toDomain),
    };
  }

  async findOne(fields: IFindOptions<Role>): Promise<NullableType<Role>> {
    const entity = await this.rolesRepository.findOne({
      where: fields,
    });
    return entity ? RoleMapper.toDomain(entity) : null;
  }

  @Transactional()
  async update(role: Role): Promise<Role> {
    const roleEntity = await this.rolesRepository.save(
      RoleMapper.toPersistence(role)
    );
    return RoleMapper.toDomain(roleEntity);
  }

  @Transactional()
  async delete(id: Role['id']): Promise<void> {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      return;
    }

    await this.rolesRepository.remove(role);
  }

  async roleAssignedToAdmins(id: Role['id']) {
    return await this.rolesRepository.exists({
      where: {
        id,
        admins: {
          id: Not(IsNull()),
        },
      },
    });
  }
}
