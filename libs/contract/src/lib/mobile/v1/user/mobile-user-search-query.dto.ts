import { IsOptional, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../../../common/src/lib/decorators/transform.decorators';

export class MobileUserSearchQueryDto {
  @IsOptional()
  @IsString()
  @ToLowerCase()
  text?: string;
}
