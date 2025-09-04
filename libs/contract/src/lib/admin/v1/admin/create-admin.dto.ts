import { ToLowerCase, Trim } from '@./common/decorators/transform.decorators';
import { IsNotExists } from '@./database/utils/validators/is-not-exists.validator';
import { AdminEntity } from '../../../../../../admin/src/lib/infrastructure/persistence/entities/admin.entity';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @Trim()
  @ToLowerCase()
  @IsEmail()
  @IsNotExists(
    {
      table: AdminEntity.name,
      column: 'email',
      ignoreColumn: 'id',
    },
    {
      message: 'Email already exists',
    }
  )
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsBoolean()
  isSuper?: boolean;

  @IsArray()
  @IsInt({ each: true })
  roleIds!: number[];

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
