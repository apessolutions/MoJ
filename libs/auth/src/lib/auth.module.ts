import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserPersistenceModule } from '../../../user/src/lib/infrastructure/persistence/persistence.module';

import { AdminAuthService } from './application/services/admin-auth.service';
import { UserAuthService } from './application/services/user-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AdminPersistenceModule } from '../../../admin/src/lib/infrastructure/persistence/persistence.module';
import { CodeModule } from '@./code/code.module';
import { MailModule } from '@./mail/mail.module';
import { SessionModule } from 'libs/session/src/lib/session.module';
import { AdminAuthGuard } from './guards/admin.guard';
import { UserAuthGuard } from './guards/user.guard';

@Global()
@Module({
  imports: [
    CodeModule,
    SessionModule,
    UserPersistenceModule,
    AdminPersistenceModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    UserAuthService,
    AdminAuthService,
    AdminAuthGuard,
    UserAuthGuard,
  ],
  exports: [UserAuthService, AdminAuthService, AdminAuthGuard, UserAuthGuard],
})
export class AuthModule {}
