import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { SessionService } from './application/services/session.service';
import { SessionPersistenceModule } from './infrastructure/persistence/persistence.module';
import { CleanExpiredSessionsJob } from './jobs/clean-expired-sessions.job';

const JOB_QUEUE = 'queue.job';

@Module({
  imports: [
    SessionPersistenceModule,
    BullModule.registerQueue({
      name: JOB_QUEUE,
    }),
  ],
  providers: [SessionService, CleanExpiredSessionsJob],
  exports: [SessionService, SessionPersistenceModule, CleanExpiredSessionsJob],
})
export class SessionModule {}
