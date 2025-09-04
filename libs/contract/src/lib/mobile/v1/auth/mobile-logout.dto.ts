import { IsString } from 'class-validator';

export class MobileLogoutDto {
  @IsString()
  deviceId!: string;
}
