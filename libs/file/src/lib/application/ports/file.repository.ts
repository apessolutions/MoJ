import { FileType } from '../../domain/file';
import { EntityCondition } from '../../../../../common/src/lib/types/entity-condition.type';
import { NullableType } from '../../../../../common/src/lib/types/nullable.type';
import { IFindOptions } from '../../../../../common/src/lib/types/query.type';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findOne(
    fields: EntityCondition<FileType>
  ): Promise<NullableType<FileType>>;

  abstract delete(filter: IFindOptions<FileType>): Promise<void>;
}
