/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';

import { UserDevice } from '../../domain/user-device';
import { UserDeviceRepository } from '../ports/user-device.repository';

import { FindConfig, IFindOptions } from '@./common/types/query.type';

@Injectable()
export class UserDeviceService {
  constructor(private repository: UserDeviceRepository) {}

  async find({
    fields,
    options,
  }: {
    fields: IFindOptions<UserDevice>;
    options?: FindConfig<UserDevice>;
  }): Promise<UserDevice[]> {
    return this.repository.find({ fields, options });
  }
}
