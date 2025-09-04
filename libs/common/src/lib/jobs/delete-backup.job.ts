import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { BaseJob } from './base.job';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { S3Service } from '../services/s3.service';
import {
  DELETE_BACKUP_JOP_PROCESS,
  JOB_QUEUE,
} from '@./common/constants/jobs.constants';
import { BACKUP_PREFIX } from '@./common/constants/backup.constants';

@Processor(JOB_QUEUE)
export class DeleteBackupJob extends BaseJob {
  BACKUP_RETENTION_PERIOD = 7;
  constructor(
    @InjectQueue(JOB_QUEUE) jobQueue: Queue,
    private readonly s3Service: S3Service
  ) {
    super(
      CronExpression.EVERY_30_MINUTES,
      DELETE_BACKUP_JOP_PROCESS,
      {},
      jobQueue
    );
  }

  @Process(DELETE_BACKUP_JOP_PROCESS)
  async deleteBackup() {
    const files = await this.s3Service.list(BACKUP_PREFIX);

    const currentTimestamp = Date.now();
    const retentionPeriod = this.BACKUP_RETENTION_PERIOD * 24 * 60 * 60 * 1000;

    const objectsToDelete = files?.filter(
      (object) =>
        currentTimestamp - object.LastModified!.getTime() >= retentionPeriod
    );
    if (objectsToDelete) {
      await Promise.all(
        objectsToDelete.map((o) => this.s3Service.deleteKey(o.Key!))
      );
    }
  }
}
