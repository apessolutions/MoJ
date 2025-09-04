import { Queue } from 'bull';
import { CronExpression } from '@nestjs/schedule';

export class BaseJob {
  constructor(
    protected readonly cronExpression: CronExpression,
    protected readonly jobProcess: string,
    protected readonly data: any,
    protected readonly jobQueue: Queue,
  ) {
    this.jobQueue.add(jobProcess, data, {
      repeat: {
        cron: cronExpression,
      },
      jobId: jobProcess, // Unique job id
      removeOnComplete: true,
      removeOnFail: true,
    });

    this.deleteDuplicateJobs();
  }

  async deleteDuplicateJobs() {
    const jobs = await this.jobQueue.getRepeatableJobs();
    const duplicateJobs = jobs.filter((job) => job.id === this.jobProcess);

    if (duplicateJobs.length > 1) {
      const unwantedJobs = duplicateJobs.filter(
        (job) => job.cron !== this.cronExpression,
      );

      await Promise.all(
        unwantedJobs.map((job) => this.jobQueue.removeRepeatableByKey(job.key)),
      );
    }
  }
}
