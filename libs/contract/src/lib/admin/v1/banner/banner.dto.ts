/* eslint-disable @nx/enforce-module-boundaries */

import { Banner } from '@./banner/domain/banner';
import {
  BannerInternalType,
  BannerType,
} from '@./banner/enums/banner-type.enum';
import { MaybeType } from '@./common/types/maybe.type';
import { FileType } from '@./file/domain/file';

export class BannerDto {
  id!: number;
  title!: string;
  type!: BannerType;
  internalType?: BannerInternalType;
  linkValue!: string;
  media!: FileType;
  order!: number;
  status!: boolean;
  from?: Date;
  to?: Date;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;

  constructor(banner: Banner) {
    this.id = banner.id;
    this.title = banner.title;
    this.type = banner.type;
    this.internalType = banner.internalType;
    this.linkValue = banner.linkValue;
    this.media = banner.media;
    this.order = banner.order;
    this.status = banner.status;
    this.from = banner.from;
    this.to = banner.to;
    this.createdAt = banner.createdAt;
    this.updatedAt = banner.updatedAt;
  }
}
