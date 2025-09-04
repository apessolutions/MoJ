import { Session } from '../../../domain/session';
import { SessionEntity } from '../entities/session.entity';

export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;
    domainEntity.userId = raw.userId;
    domainEntity.userType = raw.userType;
    domainEntity.expiresAt = raw.expiresAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Session): SessionEntity {
    const persistenceEntity = new SessionEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.userId = domainEntity.userId;
    persistenceEntity.userType = domainEntity.userType;
    persistenceEntity.expiresAt = domainEntity.expiresAt;

    return persistenceEntity;
  }
}
