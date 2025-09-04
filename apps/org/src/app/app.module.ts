import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';

import { AdminsModule } from './modules/admins/admins.module';
import { ApiAuthModule } from './modules/auth/auth.module';
import { BannerModule } from './modules/banners/banners.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CoreModule } from './modules/core/core.module';
import { FileModule } from './modules/file/file.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

import { CommonModule } from '@./common/common.module';
import { ConfigModule } from '@./config/config.module';
import { DatabaseModule } from '@./database/database.module';
import { AuthModule } from 'libs/auth/src/lib/auth.module';
import { AuditTrailModule } from '../../../../libs/audit-trail/src/lib/audit-trail.module';

@Module({
  imports: [
    AuthModule,
    ApiAuthModule,
    AuditTrailModule,
    ConfigModule.register([]),
    EventEmitterModule.forRoot(),
    CommonModule.register(true, {}, 'admin-api'),
    DatabaseModule,
    FileModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    RolesModule,
    CoreModule,
    AdminsModule,
    BannerModule,
    CampaignsModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
