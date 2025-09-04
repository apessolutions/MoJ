import { Module } from '@nestjs/common';

import { UserService } from './application/services/user.service';
import { UserDeviceService } from './application/services/user-device.service';
import { UserPersistenceModule } from './infrastructure/persistence/persistence.module';
import { UserTransformer } from './transformers/user.transformer';

@Module({
  imports: [UserPersistenceModule],
  providers: [UserService, UserTransformer, UserDeviceService, UserTransformer],
  exports: [
    UserPersistenceModule,
    UserService,
    UserDeviceService,
    UserTransformer,
  ],
})
export class UserModule {}
