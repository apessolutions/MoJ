import { PhoneNumber } from '../../domain/phone-number';

import { NullableType } from '@./common/types/nullable.type';
import { IFindOptions } from '@./common/types/query.type';

// import { IFindOptions, NullableType } from '@./common';

export abstract class PhoneNumberRepository {
  abstract create(phoneNumber: string, code: string): Promise<PhoneNumber>;
  abstract update(phoneNumber: PhoneNumber): Promise<PhoneNumber>;
  abstract findOne(
    filters: IFindOptions<PhoneNumber>
  ): Promise<NullableType<PhoneNumber>>;
  abstract delete(filter: IFindOptions<PhoneNumber>): Promise<void>;
}
