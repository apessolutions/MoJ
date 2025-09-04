import { IsString } from 'class-validator';

export class MobileContinueAsAGuestDto {
  @IsString()
  deviceId!: string;
}
