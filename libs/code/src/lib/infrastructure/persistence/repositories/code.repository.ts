import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeRepository } from '../../../application/ports/code.repository';
import { CodeEntity } from '../entities/code.entity';
import { CodeMapper } from '../mappers/code.mapper';
import { Transactional } from 'typeorm-transactional';
import { Code } from '@./code/domain/code';
import { FindConfig, IFindOptions } from '@./common/types/query.type';
import { NullableType } from '@./common/types/nullable.type';
import { buildQuery } from '../../../../../../common/src/lib/query/build-query.utils';

@Injectable()
export class CodeRelationalRepository implements CodeRepository {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly repository: Repository<CodeEntity>
  ) {}

  @Transactional()
  async create(data: Code): Promise<Code> {
    const newEntity = await this.repository.save(
      CodeMapper.toPersistence(data)
    );
    return CodeMapper.toDomain(newEntity);
  }

  async findOne(fields: IFindOptions<CodeEntity>): Promise<NullableType<Code>> {
    const query = buildQuery(fields, {
      order: {
        id: 'DESC',
      },
    } as FindConfig<CodeEntity>);
    const entity = await this.repository.findOne(query);
    return entity ? CodeMapper.toDomain(entity) : null;
  }

  @Transactional()
  async delete(id: Code['id']) {
    const code = await this.repository.findOne({ where: {} });
    if (!code) return;
    await this.repository.remove(code);
  }
}
