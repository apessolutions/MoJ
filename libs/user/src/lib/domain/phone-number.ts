// import { NullableType } from '@./common';

import { NullableType } from '@./common/types/nullable.type';

export class PhoneNumber {
  id!: number;
  phoneNumber!: string;
  verificationCode!: string;
  codeCreatedAt!: NullableType<Date>;
}
