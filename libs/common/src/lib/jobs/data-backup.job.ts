import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { BaseJob } from './base.job';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as fs from 'fs';
import { exec } from 'child_process';
import { S3Service } from '../services/s3.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../../../database/src/lib/config/database-config.type';
import {
  DATA_BACKUP_JOP_PROCESS,
  JOB_QUEUE,
} from '@./common/constants/jobs.constants';
import { BACKUP_PREFIX } from '@./common/constants/backup.constants';

@Processor(JOB_QUEUE)
export class DataBackupJob extends BaseJob {
  constructor(
    @InjectQueue(JOB_QUEUE) jobQueue: Queue,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService<DatabaseConfig>
  ) {
    super(
      CronExpression.EVERY_30_MINUTES,
      DATA_BACKUP_JOP_PROCESS,
      {},
      jobQueue
    );
  }

  private async _backupAndUploadToS3(data: {
    dbName: string;
    dbPass: string;
    dbHost: string;
    dbUser: string;
    dbPort: number;
  }) {
    const format = 'sql';

    const { dbName, dbPort, dbHost, dbPass, dbUser } = data;

    // create a custom backup file name with date info
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const backupFilePath = `./backups/${dbName}-${currentDate}.${format}`;
    exec(
      `sh libs/scripts/sql-backup.sh '${dbPass}' ${dbHost} ${dbUser} ${dbPort} ${dbName} ${backupFilePath}`,
      async (error, stdout, stderr) => {
        if (error) {
          return console.error(`exec error: ${error}`);
        }
        if (stderr) {
          return console.error(`stderr: ${stderr}`);
        }
        const file = fs.readFileSync(backupFilePath);
        await this.s3Service.upload(
          file,
          'text/plain',
          `${BACKUP_PREFIX}/${dbName}-${currentDate}.sql`
        );
        fs.rmSync(backupFilePath);
      }
    );
  }

  @Process(DATA_BACKUP_JOP_PROCESS)
  async backupData() {
    const dbName = this.configService.getOrThrow('database.name', {
      infer: true,
    });
    const dbPass = this.configService.getOrThrow('database.password', {
      infer: true,
    });
    const dbHost = this.configService.getOrThrow('database.host', {
      infer: true,
    });
    const dbUser = this.configService.getOrThrow('database.username', {
      infer: true,
    });
    const dbPort = this.configService.getOrThrow('database.port', {
      infer: true,
    });

    await this._backupAndUploadToS3({
      dbHost,
      dbName,
      dbPass,
      dbPort,
      dbUser,
    });
  }
}
