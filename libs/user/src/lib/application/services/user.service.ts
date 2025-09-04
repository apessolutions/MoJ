/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';

import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';
import { IUpdateUser } from '../../interfaces/update-user.interface';
import { UserRepository } from '../ports/user.repository';

import { Campaign } from '@./campaigns/domain/campaign';
import { ResponseMessage } from '@./common/enums/response-message.enum';
import { ResponseStatus } from '@./common/enums/response-status.enum';
import { IFindOptions } from '@./common/types/query.type';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async findOne(fields: IFindOptions<UserEntity>) {
    const user = await this.repository.findOne(fields);

    if (!isDefined(user)) {
      throw new HttpException(
        ResponseMessage.notFound,
        ResponseStatus.notFound
      );
    }

    return user;
  }

  async update(id: number, dto: IUpdateUser) {
    const user = await this.findOne({ id });

    Object.keys(dto).map((key: string) => {
      // @ts-ignore
      if (isDefined(dto[key])) {
        // @ts-ignore
        user[key] = dto[key];
      }
    });

    return await this.repository.update(user);
  }

  async userNameExists(username: string) {
    const user = await this.repository.findOne(
      { userName: username },
      { withDeleted: true }
    );

    if (isDefined(user)) {
      throw new ConflictException({
        message: 'Username already exists!',
      });
    }
  }

  async findForCampaign(campaign: Campaign) {
    return await this.repository.findForCampaign(campaign);
  }
}
