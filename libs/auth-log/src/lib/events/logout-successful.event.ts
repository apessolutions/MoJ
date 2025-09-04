import { UserTypeEnum } from '@./common/enums/user-type.enum';

export class LogoutSuccessfulEvent {
  static event = `EVENT.LOGOUT_SUCCESSFUL`;

  constructor(
    public readonly userId: number,
    public readonly userType: UserTypeEnum
  ) {}
}
