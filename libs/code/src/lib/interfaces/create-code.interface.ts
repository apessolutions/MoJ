import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { CodeTypeEnum } from '../enums/code-type.enum';

export interface ICreateCode {
  userId: number;
  userType: UserTypeEnum;
  codeType: CodeTypeEnum;
}
