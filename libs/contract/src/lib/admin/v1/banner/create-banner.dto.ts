/* eslint-disable @nx/enforce-module-boundaries */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

import {
  BannerInternalType,
  BannerType,
} from '@./banner/enums/banner-type.enum';
import { IsExists } from '@./database/utils/validators/is-exists.validator';
import { FileEntity } from '@./file/infrastructure/persistence/entities/file.entity';

export class CreateBannerDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ enum: Object.values(BannerType) })
  @IsNotEmpty()
  @IsEnum(BannerType)
  type!: BannerType;

  @ApiProperty({ enum: Object.values(BannerInternalType) })
  @IsNotEmpty()
  @ValidateIf((o) => o.type === BannerType.INTERNAL)
  @IsEnum(BannerInternalType)
  internalType?: BannerInternalType;

  @ApiProperty({ type: String, default: '' })
  @IsString()
  @ValidateIf((o) => o.type !== BannerType.NONE)
  @IsNotEmpty({ message: 'Link value is required' })
  linkValue!: string;

  @ApiProperty({ type: Number })
  @IsExists(
    {
      table: FileEntity.name,
      column: 'id',
    },
    {
      message: 'Media is not found',
    }
  )
  mediaId!: number;

  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  from?: Date;

  @ApiProperty({ type: Date })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  to?: Date;
}
