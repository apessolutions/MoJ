import { Role } from '../../domain/role';
import { OmittedType } from '../../../../../common/src/lib/types/omitted.type';
import {
  FindConfig,
  IFindOptions,
} from '../../../../../common/src/lib/types/query.type';
import { IPaginationResult } from '../../../../../common/src/lib/types/pagination-result';
import { NullableType } from '@./common/types/nullable.type';

export abstract class RoleRepository {
  abstract create(data: OmittedType<Role>): Promise<Role>;
  abstract findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<Role>;
    config: FindConfig<Role>;
  }): Promise<IPaginationResult<Role>>;
  abstract findMany(filters: IFindOptions<Role>): Promise<Role[]>;
  abstract findOne(fields: IFindOptions<Role>): Promise<NullableType<Role>>;
  abstract update(role: Role): Promise<Role>;
  abstract delete(id: Role['id']): Promise<void>;
  abstract roleAssignedToAdmins(id: Role['id']): Promise<boolean>;
}
