import { MaybeType } from '../../../../common/src/lib/types/maybe.type';
import {
  ToBoolean,
  ToInt,
} from '../../../../common/src/lib/decorators/transform.decorators';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class BaseEnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: MaybeType<string>;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: MaybeType<string>;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: MaybeType<string>;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @ToInt()
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: MaybeType<number>;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: MaybeType<string>;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: MaybeType<string>;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: MaybeType<boolean>;

  @IsInt()
  @ToInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: MaybeType<number>;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: MaybeType<boolean>;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: MaybeType<boolean>;

  @IsString()
  @IsOptional()
  DATABASE_CA: MaybeType<string>;

  @IsString()
  @IsOptional()
  DATABASE_KEY: MaybeType<string>;

  @IsString()
  @IsOptional()
  DATABASE_CERT: MaybeType<string>;
}
