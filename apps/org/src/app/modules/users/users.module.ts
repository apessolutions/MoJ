import { Module } from '@nestjs/common';

import { UsersController } from './controllers/v1/users.controller';
import { UserService } from './services/users.service';
import { UserTransformerModule } from './transformers/users-transformer.module';

import { UserPersistenceModule } from '@./user/infrastructure/persistence/persistence.module';

@Module({
  imports: [UserPersistenceModule, UserTransformerModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserTransformerModule, UserService],
})
export class UsersModule {}
