import { Injectable } from '@nestjs/common';
import { FileRepository } from '../ports/file.repository';
import { FileType } from '../../domain/file';
import { EntityCondition } from '@./common/types/entity-condition.type';
import { NullableType } from '@./common/types/nullable.type';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findOne(fields: EntityCondition<FileType>): Promise<NullableType<FileType>> {
    return this.fileRepository.findOne(fields);
  }
}
