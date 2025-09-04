import { Code } from '../../domain/code';
import { CodeEntity } from '../../infrastructure/persistence/entities/code.entity';
import { OmittedType } from '../../../../../common/src/lib/types/omitted.type';
import { IFindOptions } from '../../../../../common/src/lib/types/query.type';
import { NullableType } from '../../../../../common/src/lib/types/nullable.type';

export abstract class CodeRepository {
  abstract create(data: OmittedType<Code>): Promise<Code>;
  abstract findOne(
    fields: IFindOptions<CodeEntity>
  ): Promise<NullableType<Code>>;
  abstract delete(id: CodeEntity['id']): Promise<void>;
}
