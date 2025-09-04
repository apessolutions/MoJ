import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNotExists } from '../../../../../../database/src/lib/utils/validators/is-not-exists.validator';
import { RoleEntity } from '../../../../../../role/src/lib/infrastructure/persistence/entities/role.entity';
import { IsPermissionType } from '../../../../../../role/src/lib/constraints/is-permission-type.constraint';
import { PermissionType } from '@./role/types/permission-type.type';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsNotExists(
    { table: RoleEntity.name, column: 'title', ignoreColumn: 'id' },
    { message: 'Title already exists' }
  )
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsArray()
  @IsPermissionType({ each: true })
  permissions!: PermissionType[];
}
