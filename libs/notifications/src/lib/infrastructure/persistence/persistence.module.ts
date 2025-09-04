import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationRepository } from '../../application/ports/notification.repository';

import { NotificationEntity } from './entities/notification.entity';
import { NotificationRelationalRepository } from './repositories/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [
    {
      provide: NotificationRepository,
      useClass: NotificationRelationalRepository,
    },
  ],
  exports: [NotificationRepository],
})
export class NotificationPersistenceModule {}
