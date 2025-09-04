import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { V1AuthController } from './controllers/v1';
import { AuthTransformerModule } from './transformers/auth-transformer.module';

import { AdminPersistenceModule } from '@./admin/infrastructure/persistence/persistence.module';
import { CodeModule } from '@./code/code.module';
import { MailModule } from '@./mail/mail.module';
import { UserPersistenceModule } from '@./user/infrastructure/persistence/persistence.module';

@Module({
  imports: [
    CodeModule,
    AuthTransformerModule,
    UserPersistenceModule,
    AdminPersistenceModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [V1AuthController],
})
export class ApiAuthModule {}
