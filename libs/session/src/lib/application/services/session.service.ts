import { Injectable } from '@nestjs/common';
import ms from 'ms';

import { Session } from '../../domain/session';
import { SessionRepository } from '../ports/session.repository';

import { UserTypeEnum } from 'libs/common/src/lib/enums/user-type.enum';
import { NullableType } from 'libs/common/src/lib/types/nullable.type';
import { IFindOptions } from 'libs/common/src/lib/types/query.type';

export interface ICreateSession {
  userId: number;
  userType: UserTypeEnum;
  expiresAfter: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(createSessionDto: ICreateSession): Promise<Session> {
    const session = new Session();
    session.userId = createSessionDto.userId;
    session.userType = createSessionDto.userType;
    session.expiresAt = new Date(
      Date.now() + ms(createSessionDto.expiresAfter)
    );
    return this.sessionRepository.create(session);
  }

  async findOneOrFail(
    filters: IFindOptions<Session>
  ): Promise<NullableType<Session>> {
    return this.sessionRepository.findOneOrFail(filters, {});
  }

  async delete(session: IFindOptions<Session>): Promise<void> {
    await this.sessionRepository.delete(session);
  }
}
