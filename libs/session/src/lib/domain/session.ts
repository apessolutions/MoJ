import { UserTypeEnum } from 'libs/common/src/lib/enums/user-type.enum';

export class Session {
  id!: number;
  userId!: number;
  userType!: UserTypeEnum;
  expiresAt!: Date;
}
