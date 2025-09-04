import { Injectable } from '@nestjs/common';

import { Banner } from '@./banner/domain/banner';
import { BannerDto } from '@./contract';

@Injectable()
export class BannerTransformer {
  mapToDto(banner: Banner) {
    return new BannerDto(banner);
  }

  mapArrToDto(banners: Banner[]) {
    return banners.map((banner) => this.mapToDto(banner));
  }
}
