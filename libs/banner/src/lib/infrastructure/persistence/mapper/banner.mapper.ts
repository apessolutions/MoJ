import { Banner } from '../../../domain/banner';
import { BannerEntity } from '../entities/banner.entity';

import { FileMapper } from '@./file/infrastructure/persistence/mappers/file.mapper';

export class BannerMapper {
  static toDomain(raw: BannerEntity): Banner {
    const banner = new Banner();
    banner.id = raw.id;
    banner.createdAt = raw.createdAt;
    banner.updatedAt = raw.updatedAt;
    banner.title = raw.title;
    banner.type = raw.type;
    banner.internalType = raw.internalType;
    banner.linkValue = raw.linkValue;
    banner.media = FileMapper.toDomain(raw.media);
    banner.order = raw.order;
    banner.status = raw.status;
    banner.from = raw.from;
    banner.to = raw.to;
    return banner;
  }

  static toPersistence(banner: Banner): BannerEntity {
    const bannerEntity = new BannerEntity();
    bannerEntity.id = banner.id;
    bannerEntity.title = banner.title;
    bannerEntity.type = banner.type;
    bannerEntity.internalType = banner.internalType;
    bannerEntity.linkValue = banner.linkValue;
    bannerEntity.media = FileMapper.toPersistence(banner.media);
    bannerEntity.order = banner.order;
    bannerEntity.status = banner.status;
    bannerEntity.from = banner.from;
    bannerEntity.to = banner.to;
    return bannerEntity;
  }
}
