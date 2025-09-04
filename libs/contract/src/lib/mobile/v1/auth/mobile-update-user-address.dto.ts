import { IsNumber, IsString } from 'class-validator';

export class MobileUpdateUserAddressDto {
  @IsString()
  deviceId!: string;

  @IsNumber()
  long!: number;

  @IsNumber()
  lat!: number;
}
