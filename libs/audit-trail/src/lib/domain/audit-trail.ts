import { EventEnum } from '../enums/events.enum';
import { NullableType } from '../../../../common/src/lib/types/nullable.type';
import { UserTypeEnum } from '../../../../common/src/lib/enums/user-type.enum';

export class AuditTrail {
  oldValue?: any;
  newValue?: any;
  event!: EventEnum;
  userId!: NullableType<number>;
  userType!: UserTypeEnum;
  recordId!: number;
  recordType!: string;
  ipAddress?: string;
  userAgent?: string;
}
