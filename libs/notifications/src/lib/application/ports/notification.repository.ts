import { Notification } from '../../domain/notification';

import { IPaginationResult } from '@./common/types/pagination-result';
import { FindConfig, IFindOptions } from '@./common/types/query.type';

export abstract class NotificationRepository {
  abstract create(data: Partial<Notification>): Promise<Notification>;
  abstract markAllAsRead(userId: number): Promise<void>;
  abstract findManyWithPagination({
    filters,
    config,
  }?: {
    filters?: IFindOptions<Notification>;
    config?: FindConfig<Notification>;
  }): Promise<IPaginationResult<Notification>>;
}
