/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';

import { BannerInternalType } from '../../enums/banner-type.enum';
import { BannerInternalTypeValidator } from '../../validators/banner-internal-type.validator';

@Injectable()
export class BannerValidatorFactory {
  constructor() {}

  createBannerInternalTypeValidator(
    type: BannerInternalType,
    linkValue: string
  ) {
    return new BannerInternalTypeValidator(type, linkValue);
  }
}
