/* eslint-disable @nx/enforce-module-boundaries */
import { BannerInternalType, BannerType } from '../enums/banner-type.enum';

import { MaybeType } from '@./common/types/maybe.type';
import { FileType } from '@./file/domain/file';

export class Banner {
  id!: number;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;
  title!: string;
  type!: BannerType;
  internalType?: BannerInternalType;
  linkValue!: string;
  media!: FileType;
  order!: number;
  status!: boolean;
  from?: Date;
  to?: Date;
}
