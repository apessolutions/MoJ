import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { NotificationRepository } from '../../../application/ports/notification.repository';
import { Notification } from '../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';

import { IPaginationResult } from '@./common/types/pagination-result';
import { FindConfig, IFindOptions } from '@./common/types/query.type';

@Injectable()
export class NotificationRelationalRepository
  implements NotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>
  ) {}

  async create(data: Notification): Promise<Notification> {
    const notificationEntity = NotificationMapper.toPersistence(data);
    const newEntity = await this.repository.save(
      this.repository.create(notificationEntity)
    );
    return NotificationMapper.toDomain(newEntity);
  }

  @Transactional()
  async markAllAsRead(userId: number): Promise<void> {
    await this.repository.update({ userId }, { isRead: true });
  }

  @Transactional()
  async findManyWithPagination({
    filters,
    config,
  }: {
    filters?: IFindOptions<Notification>;
    config?: FindConfig<Notification>;
  } = {}): Promise<IPaginationResult<Notification>> {
    const [results, total] = await this.repository.findAndCount({
      where: filters,
      ...config,
    });

    return {
      data: results.map(NotificationMapper.toDomain),
      count: total,
    };
  }
}
