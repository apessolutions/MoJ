import { Admin } from '@./admin/domain/admin';
import {
  FindConfig,
  IFindOptions,
} from '../../../../../common/src/lib/types/query.type';
import { IPaginationResult } from '../../../../../common/src/lib/types/pagination-result';
import { NullableType } from '../../../../../common/src/lib/types/nullable.type';

export abstract class AdminRepository {
  abstract create(data: Omit<Admin, 'id'>): Promise<Admin>;
  abstract findManyWithPagination({
    filters,
    config,
  }: {
    filters: IFindOptions<Admin>;
    config: FindConfig<Admin>;
  }): Promise<IPaginationResult<Admin>>;
  abstract findMany(filters: IFindOptions<Admin>): Promise<Admin[]>;
  abstract findOne(fields: IFindOptions<Admin>): Promise<NullableType<Admin>>;
  abstract update(admin: Admin): Promise<Admin>;
  abstract softDelete(id: Admin['id']): Promise<void>;
  abstract delete(id: Admin['id']): Promise<void>;
}
