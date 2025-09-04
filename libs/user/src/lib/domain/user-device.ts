// import { DeviceEnum } from '@./common';

import { DeviceEnum } from '@./common/enums/device.enum';

export class UserDevice {
  id!: number;
  userId!: number;
  deviceId!: string;
  deviceType!: DeviceEnum;
  fcmToken!: string;
}
