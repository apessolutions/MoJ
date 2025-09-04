/* eslint-disable @nx/enforce-module-boundaries */
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';

import { CreateCampaignDto } from '../../../../../contract/src/lib/admin/v1/campaign/create-campaign.dto';
import {
  CampaignRepository,
  ICampaignFindOptions,
} from '../ports/campaigns.repository';

import { Campaign } from '@./campaigns/domain/campaign';
import {
  NOTIFICATION_QUEUE,
  USER_NOTIFICATION_PROCESS,
} from '@./common/constants/notification-queue.constants';
import { IPaginationResult } from '@./common/types/pagination-result';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    @InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue
  ) {}

  async create(data: CreateCampaignDto): Promise<Campaign> {
    const campaign = await this.campaignRepository.create(data);
    await this.notificationQueue.add(USER_NOTIFICATION_PROCESS, campaign);
    return campaign;
  }

  async delete(id: number): Promise<void> {
    await this.campaignRepository.softDelete(id);
  }

  async findAll(
    options: ICampaignFindOptions
  ): Promise<IPaginationResult<Campaign>> {
    return this.campaignRepository.findManyWithPagination(options);
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne(id);
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }
}
