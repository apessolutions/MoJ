import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { CodeTypeEnum } from '../enums/code-type.enum';

export interface IVerifyCode {
  code: string;
  userId: number;
  userType: UserTypeEnum;
  codeType: CodeTypeEnum;
}
