/* eslint-disable @nx/enforce-module-boundaries */
import { BannerDto } from '../../../../libs/contract/src/lib/admin/v1/banner/banner.dto';
import {
  BannerInternalType,
  BannerType,
} from '../../../../libs/banner/src/lib/enums/banner-type.enum';
export type IBanner = BannerDto;
export { BannerInternalType, BannerType };
