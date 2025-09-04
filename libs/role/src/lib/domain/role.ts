import { PermissionType } from '../types/permission-type.type';
import { NullableType } from '../../../../common/src/lib/types/nullable.type';
import { MaybeType } from '../../../../common/src/lib/types/maybe.type';

export class Role {
  id!: number;
  title!: string;
  description?: string;
  permissions!: PermissionType[];
  tenantId?: NullableType<number>;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;
}
