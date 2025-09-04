import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReorderBannerDto {
  @ApiProperty({
    type: [Number],
  })
  @IsNumber({}, { each: true })
  banners!: number[];
}
