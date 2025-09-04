import { UserAddress } from '../../../domain/user-address';
import { UserAddressEntity } from '../entities/user-address.entity';

import { UserMapper } from './user.mapper';

export class UserAddressMapper {
  static toDomain(raw: UserAddressEntity): UserAddress {
    const userAddress = new UserAddress();
    userAddress.id = raw.id;
    userAddress.deviceId = raw.deviceId;
    userAddress.lat = raw.lat;
    userAddress.long = raw.long;
    userAddress.userId = raw.userId;
    userAddress.user = raw.user ? UserMapper.toDomain(raw.user) : null;
    return userAddress;
  }

  static toPersistence(userAddress: UserAddress): UserAddressEntity {
    const userAddressEntity = new UserAddressEntity();
    userAddressEntity.id = userAddress.id;
    userAddressEntity.deviceId = userAddress.deviceId;
    userAddressEntity.long = userAddress.long;
    userAddressEntity.lat = userAddress.lat;
    userAddressEntity.user = userAddress.user
      ? UserMapper.toPersistence(userAddress.user)
      : null;
    return userAddressEntity;
  }
}
