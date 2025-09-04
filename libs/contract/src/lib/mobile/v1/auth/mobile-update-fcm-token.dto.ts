import { IsEnum, IsString } from 'class-validator';
import { DeviceEnum } from '../../../../../../common/src/lib/enums/device.enum';

export class MobileUpdateFcmTokenDto {
  @IsString()
  deviceId!: string;

  @IsEnum(DeviceEnum)
  deviceType!: DeviceEnum;

  @IsString()
  fcmToken!: string;
}
