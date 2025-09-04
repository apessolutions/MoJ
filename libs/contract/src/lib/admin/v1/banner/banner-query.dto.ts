import { IsOptional } from 'class-validator';

export class BannerQueryDto {
  @IsOptional()
  onlyActive?: boolean;
}
