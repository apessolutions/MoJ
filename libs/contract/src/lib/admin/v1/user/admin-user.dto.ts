/* eslint-disable @nx/enforce-module-boundaries */
import { instanceToPlain } from 'class-transformer';
import { isDefined } from 'class-validator';

import { GenderEnum } from '@./common/enums/gender.enum';
import { MaybeType } from '@./common/types/maybe.type';
import { NullableType } from '@./common/types/nullable.type';
import { User } from '@./user/domain/user';

export class AdminUserDto {
  id!: number;
  firstName?: NullableType<string>;
  lastName?: NullableType<string>;
  userName?: NullableType<string>;
  gender?: NullableType<GenderEnum>;
  email?: NullableType<string>;
  photoId?: NullableType<number>;
  photo?: NullableType<string>;
  phoneNumber!: string;
  dateOfBirth?: NullableType<string>;
  status!: boolean;
  deletedAt!: MaybeType<Date>;
  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.userName = user.userName;
    this.gender = user.gender;
    this.email = user.email;
    if (isDefined(user.photo)) {
      this.photo = instanceToPlain(user.photo)['path'];
      this.photoId = user.photoId;
    }
    this.phoneNumber = user.phoneNumber;
    this.dateOfBirth = user.dateOfBirth;
    this.status = user.status;
    this.deletedAt = user.deletedAt;
  }
}
