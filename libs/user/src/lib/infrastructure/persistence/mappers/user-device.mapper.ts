import { UserDevice } from '../../../domain/user-device';
import { UserDeviceEntity } from '../entities/user-device.entity';

export class UserDeviceMapper {
  static toDomain(raw: UserDeviceEntity): UserDevice {
    const userDevice = new UserDevice();
    userDevice.id = raw.id;
    userDevice.deviceId = raw.deviceId;
    userDevice.deviceType = raw.deviceType;
    userDevice.fcmToken = raw.fcmToken;
    return userDevice;
  }

  static toPersistence(userDevice: UserDevice): UserDeviceEntity {
    const userDeviceEntity = new UserDeviceEntity();
    userDeviceEntity.id = userDevice.id;
    userDeviceEntity.deviceId = userDevice.deviceId;
    userDeviceEntity.deviceType = userDevice.deviceType;
    userDeviceEntity.fcmToken = userDevice.fcmToken;
    return userDeviceEntity;
  }
}
