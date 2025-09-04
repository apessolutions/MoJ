/* eslint-disable @nx/enforce-module-boundaries */
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { BaseJob } from './base.job';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as fs from 'fs';
import { exec } from 'child_process';
import { S3Service } from '../services/s3.service';
import { ConfigService } from '@nestjs/config';
import {
  JOB_QUEUE,
  LOGS_BACKUP_JOP_PROCESS,
} from '@./common/constants/jobs.constants';
import { MongoConfig } from '@./audit-trail/config/mongo-config.type';
import { BACKUP_PREFIX } from '@./common/constants/backup.constants';

@Processor(JOB_QUEUE)
export class LogsBackupJob extends BaseJob {
  constructor(
    @InjectQueue(JOB_QUEUE) jobQueue: Queue,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService<MongoConfig>
  ) {
    super(
      CronExpression.EVERY_30_MINUTES,
      LOGS_BACKUP_JOP_PROCESS,
      {},
      jobQueue
    );
  }

  private async _backupAndUploadToS3(url: string) {
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const backupFilePath = `./backups/mongo-backup-${currentDate}.gz`;

    exec(
      `mongodump --uri="${url}" --archive="${backupFilePath}" --gzip &>/dev/null`,
      async (error) => {
        if (error) {
          return console.error(`exec error: ${error}`);
        }
        const file = fs.readFileSync(backupFilePath);
        await this.s3Service.upload(
          file,
          'application/gzip',
          `${BACKUP_PREFIX}/mongo-backup-${currentDate}.gz`
        );
        fs.rmSync(backupFilePath);
      }
    );
  }

  @Process(LOGS_BACKUP_JOP_PROCESS)
  async backupLogs() {
    const url = this.configService.getOrThrow('mongo.url', {
      infer: true,
    });

    await this._backupAndUploadToS3(url);
  }
}
