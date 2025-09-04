// import { FindConfig, IFindOptions } from '@./common';
import { UserDevice } from '../../domain/user-device';

import { FindConfig, IFindOptions } from '@./common/types/query.type';

export abstract class UserDeviceRepository {
  abstract create(data: Omit<UserDevice, 'id'>): Promise<UserDevice>;
  abstract find({
    fields,
    options,
  }: {
    fields: IFindOptions<UserDevice>;
    options?: FindConfig<UserDevice>;
  }): Promise<UserDevice[]>;
  abstract delete(fields: IFindOptions<UserDevice>): Promise<void>;
}
