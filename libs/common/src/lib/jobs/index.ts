import { DataBackupJob } from './data-backup.job';
import { DeleteBackupJob } from './delete-backup.job';
import { LogsBackupJob } from './logs-backup.job';

export const JOBS = [DataBackupJob, DeleteBackupJob, LogsBackupJob];
