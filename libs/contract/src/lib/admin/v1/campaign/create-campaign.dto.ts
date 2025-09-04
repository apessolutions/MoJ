import { Type } from 'class-transformer';
import { GenderEnum } from '../../../../../../common/src/lib/enums/gender.enum';

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ type: String, example: 'Campaign title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ type: String, example: 'Campaign message' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ type: Array, example: Object.values(GenderEnum) })
  @IsEnum(GenderEnum, { each: true })
  @IsOptional()
  gender!: GenderEnum[];

  @ApiProperty({ type: Number, example: 18 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  minAge!: number | null;

  @ApiProperty({ type: Number, example: 65 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  maxAge!: number | null;
}
