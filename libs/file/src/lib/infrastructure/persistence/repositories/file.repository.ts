import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FileRepository } from '../../../application/ports/file.repository';

import { FileMapper } from '../mappers/file.mapper';
import { FileType } from '../../../domain/file';
import { Transactional } from 'typeorm-transactional';
import { EntityCondition } from '@./common/types/entity-condition.type';
import { NullableType } from '@./common/types/nullable.type';
import { IFindOptions } from '@./common/types/query.type';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  @Transactional()
  async create(data: FileType): Promise<FileType> {
    const persistenceModel = FileMapper.toPersistence(data);
    return this.fileRepository.save(
      this.fileRepository.create(persistenceModel)
    );
  }

  @Transactional()
  async findOne(
    fields: EntityCondition<FileType>
  ): Promise<NullableType<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: fields as FindOptionsWhere<FileEntity>,
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  @Transactional()
  async delete(filter: IFindOptions<FileType>): Promise<void> {
    const entity = await this.fileRepository.findOne({
      where: filter as FindOptionsWhere<FileEntity>,
    });
    if (entity) {
      await this.fileRepository.remove(entity);
    }
    return;
  }
}
