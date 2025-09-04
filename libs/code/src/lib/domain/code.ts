import { CodeTypeEnum } from '../enums/code-type.enum';
import { UserTypeEnum } from '../../../../common/src/lib/enums/user-type.enum';
import { MaybeType } from '../../../../common/src/lib/types/maybe.type';

export class Code {
  id!: number;
  userId!: number;
  userType!: UserTypeEnum;
  codeType!: CodeTypeEnum;
  code!: string;
  createdAt: MaybeType<Date>;
}
