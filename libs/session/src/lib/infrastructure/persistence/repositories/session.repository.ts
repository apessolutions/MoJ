import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SessionRepository } from '../../../application/ports/session.repository';
import { Session } from '../../../domain/session';
import { SessionEntity } from '../entities/session.entity';
import { SessionMapper } from '../mappers/session.mapper';

import { NullableType } from '@./common/types/nullable.type';
import { FindConfig, IFindOptions } from '@./common/types/query.type';
import { buildQuery } from '../../../../../../common/src/lib/query/build-query.utils';

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const newEntity = await this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel)
    );
    return SessionMapper.toDomain(newEntity);
  }

  async findOne(
    options: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<NullableType<Session>> {
    const query = buildQuery(options, config);
    const entity = await this.sessionRepository.findOne(query);
    return entity ? SessionMapper.toDomain(entity) : null;
  }

  async findOneOrFail(
    options: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<Session> {
    const query = buildQuery(options, config);
    const entity = await this.sessionRepository.findOne(query);
    if (!entity) {
      throw new NotFoundException('Session not found');
    }
    return SessionMapper.toDomain(entity);
  }

  async findMany(
    options: IFindOptions<Session>,
    config: FindConfig<Session>
  ): Promise<Session[]> {
    const query = buildQuery(options, config);
    const entities = await this.sessionRepository.find(query);
    return entities.map(SessionMapper.toDomain);
  }

  async delete(options: IFindOptions<Session>): Promise<void> {
    const query = buildQuery(options);
    const sessions = await this.sessionRepository.find(query);
    await this.sessionRepository.remove(sessions);
  }
}
