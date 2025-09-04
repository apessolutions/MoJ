import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// UserAddressRepository,
// UserDeviceRepository,
// UserRepository,
import { PhoneNumberRepository } from '../../application/ports/phone-number.repository';
import { UserRepository } from '../../application/ports/user.repository';
import { UserAddressRepository } from '../../application/ports/user-address.repository';
import { UserDeviceRepository } from '../../application/ports/user-device.repository';

import { PhoneNumberEntity } from './entities/phone-number.entity';
import { UserEntity } from './entities/user.entity';
import { UserAddressEntity } from './entities/user-address.entity';
import { UserDeviceEntity } from './entities/user-device.entity';
import { PhoneNumberRelationalRepository } from './repositories/phone-number.repository';
import { UserRelationalRepository } from './repositories/user.repository';
import { UserAddressRelationalRepository } from './repositories/user-address.repository';
import { UserDeviceRelationalRepository } from './repositories/user-device.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDeviceEntity,
      PhoneNumberEntity,
      UserAddressEntity,
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRelationalRepository,
    },
    {
      provide: UserDeviceRepository,
      useClass: UserDeviceRelationalRepository,
    },
    {
      provide: UserAddressRepository,
      useClass: UserAddressRelationalRepository,
    },
    {
      provide: PhoneNumberRepository,
      useClass: PhoneNumberRelationalRepository,
    },
  ],
  exports: [
    UserRepository,
    UserDeviceRepository,
    PhoneNumberRepository,
    UserAddressRepository,
  ],
})
export class UserPersistenceModule {}
