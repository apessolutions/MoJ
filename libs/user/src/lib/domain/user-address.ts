import { User } from './user';

import { NullableType } from '@./common/types/nullable.type';

export class UserAddress {
  id!: number;
  deviceId!: string;
  userId!: number;
  user?: NullableType<User>;
  long!: number;
  lat!: number;
}
