import { UserTypeEnum } from '@./common/enums/user-type.enum';

export class LoginFailedEvent {
  static event = `EVENT.LOGIN_FAILED`;

  constructor(
    public readonly userId: number,
    public readonly userType: UserTypeEnum
  ) {}
}
