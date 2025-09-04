import { Session } from '../../domain/session';

import { NullableType } from 'libs/common/src/lib/types/nullable.type';
import { FindConfig, IFindOptions } from '@./common/types/query.type';

export abstract class SessionRepository {
  abstract create(session: Omit<Session, 'id'>): Promise<Session>;
  abstract findOne(
    session: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<NullableType<Session>>;

  abstract findOneOrFail(
    session: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<Session>;

  abstract findMany(
    session: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<Session[]>;

  abstract delete(session: IFindOptions<Session>): Promise<void>;
}
