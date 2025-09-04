import { UserTypeEnum } from '../../../../common/src/lib/enums/user-type.enum';

export class LoginSuccessfulEvent {
  static event = `EVENT.LOGIN_SUCCESSFUL`;

  constructor(
    public readonly userId: number,
    public readonly userType: UserTypeEnum
  ) {}
}
