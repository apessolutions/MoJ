import { User } from '../../../domain/user';
import { UserEntity } from '../entities/user.entity';

import { FileMapper } from '@./file/infrastructure/persistence/mappers/file.mapper';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.userName = raw.userName;
    user.gender = raw.gender;
    user.dateOfBirth = raw.dateOfBirth;
    user.phoneNumber = raw.phoneNumber;
    user.photo = raw.photo;
    user.status = raw.status;
    user.deletedAt = raw.deletedAt;
    return user;
  }

  static toPersistence(user: User): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = user.id;
    userEntity.email = user.email;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.userName = user.userName;
    userEntity.gender = user.gender;
    userEntity.dateOfBirth = user.dateOfBirth;
    userEntity.phoneNumber = user.phoneNumber;
    userEntity.photo = user.photo ? FileMapper.toPersistence(user.photo) : null;
    userEntity.status = user.status;
    userEntity.deletedAt = user.deletedAt;
    return userEntity;
  }
}
