import { UserAddress } from '../../domain/user-address';

import { NullableType } from '@./common/types/nullable.type';

// import { NullableType } from '@./common';

export abstract class UserAddressRepository {
  abstract create(
    data: Omit<UserAddress, 'id' | 'userId'>
  ): Promise<UserAddress>;
  abstract update(data: UserAddress): Promise<UserAddress>;
  abstract findUserAddress(userId: number): Promise<NullableType<UserAddress>>;
  abstract findGuestAddress(
    deviceId: string
  ): Promise<NullableType<UserAddress>>;
}
