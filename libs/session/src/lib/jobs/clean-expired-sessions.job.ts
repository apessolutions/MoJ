import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { LessThan } from 'typeorm';

import { SessionService } from '../application/services/session.service';
import { CLEAN_EXPIRED_SESSIONS_JOB_PROCESS } from '../constants/session-jobs.constants';

import { BaseJob } from 'libs/common/src/lib/jobs/base.job';

const JOB_QUEUE = 'queue.job';

@Processor(JOB_QUEUE)
export class CleanExpiredSessionsJob extends BaseJob {
  constructor(
    @InjectQueue(JOB_QUEUE) jobQueue: Queue,
    private readonly sessionService: SessionService
  ) {
    super(
      CronExpression.EVERY_HOUR,
      CLEAN_EXPIRED_SESSIONS_JOB_PROCESS,
      {},
      jobQueue
    );
  }

  @Process(CLEAN_EXPIRED_SESSIONS_JOB_PROCESS)
  async cleanExpiredSessions() {
    await this.sessionService.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
