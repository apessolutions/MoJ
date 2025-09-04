/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, NotFoundException } from '@nestjs/common';
import { isDefined } from 'class-validator';

import { BannerValidatorFactory } from '@./banner/application/factories/banner-validation.factory';
import { BannerRepository } from '@./banner/application/ports/banner.repository';
import { Banner } from '@./banner/domain/banner';
import { BannerType } from '@./banner/enums/banner-type.enum';
import { ValidationRunner } from '@./common/utils/validation-runner.utils';
import {
  CreateBannerDto,
  ReorderBannerDto,
  UpdateBannerDto,
} from '@./contract';
import { FileRepository } from '@./file/application/ports/file.repository';
import { FileMapper } from '@./file/infrastructure/persistence/mappers/file.mapper';

@Injectable()
export class BannersService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly validatorFactory: BannerValidatorFactory,
    private readonly fileRepository: FileRepository
  ) {}

  async create(createBannerDto: CreateBannerDto) {
    const { mediaId, ...rest } = createBannerDto;
    if (rest.type === BannerType.INTERNAL) {
      const validationRunner = new ValidationRunner([
        this.validatorFactory.createBannerInternalTypeValidator(
          rest.internalType!,
          rest.linkValue
        ),
      ]);
      await validationRunner.run();
    }
    const lastOrderBanner = await this.bannerRepository.findLastOrderBanner();

    if (isDefined(lastOrderBanner)) {
      if (rest.order > lastOrderBanner.order)
        rest.order = lastOrderBanner.order + 1;
      else
        await this.bannerRepository.incrementBannersOrder(
          rest.order,
          lastOrderBanner.order,
          true,
          true
        );
    } else rest.order = 1;

    const media = await this.fileRepository.findOne({
      id: mediaId,
    });

    const newBanner = await this.bannerRepository.create({
      ...rest,
      media: FileMapper.toPersistence(media!),
      status: true,
    });

    return newBanner;
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannerRepository.findOne({
      filters: { id: id },
    });

    if (!banner) {
      throw new NotFoundException({
        message: 'Banner not found',
      });
    }

    const { mediaId, order, ...rest } = updateBannerDto;

    if (rest.type === BannerType.INTERNAL && rest.internalType) {
      const validationRunner = new ValidationRunner([
        this.validatorFactory.createBannerInternalTypeValidator(
          rest.internalType,
          rest.linkValue
        ),
      ]);
      await validationRunner.run();
    }

    if (banner.order !== order) {
      const lastOrderBanner = await this.bannerRepository.findLastOrderBanner();

      const oldOrderBanner = await this.bannerRepository.findOne({
        filters: {
          order,
        },
      });

      if (isDefined(oldOrderBanner) && oldOrderBanner.id !== banner.id) {
        // there is a banner with the same order
        if (order > banner.order) {
          // decrement all orders > banner.order and <= order
          await this.bannerRepository.decrementBannersOrder(
            banner.order,
            order,
            false,
            true
          );
        } else {
          // increment all orders < banner.order and >= order
          await this.bannerRepository.incrementBannersOrder(
            order,
            banner.order,
            true,
            false
          );
        }

        banner.order = order;
      } else {
        // it is not existing order
        if (isDefined(lastOrderBanner)) {
          // decrement all orders > banner.order and <= lastOrderBanner.order
          await this.bannerRepository.decrementBannersOrder(
            banner.order,
            lastOrderBanner.order,
            false,
            true
          );

          banner.order = lastOrderBanner.order; // it is the new last order after decrementing + 1
        } else {
          banner.order = 1;
        }
      }
    }

    const media = await this.fileRepository.findOne({
      id: mediaId,
    });

    if (media) {
      banner.media = media;
    }

    Object.keys(rest).forEach((key) => {
      if (isDefined(rest[key])) {
        banner[key] = rest[key];
      }
    });

    await this.bannerRepository.update(banner);
    return banner;
  }

  async findAll(): Promise<Banner[]> {
    const banners = await this.bannerRepository.find({});
    return banners;
  }

  async toggleStatus(id: number) {
    const banner = await this.bannerRepository.findOne({
      filters: { id: id },
    });

    if (!banner) {
      throw new NotFoundException({
        message: 'Banner not found',
      });
    }

    banner.status = !banner.status;

    await this.bannerRepository.update(banner);

    return banner;
  }

  async delete(id: number) {
    const banner = await this.bannerRepository.findOne({
      filters: { id: id },
    });

    if (!banner) {
      throw new NotFoundException({
        message: 'Banner not found',
      });
    }

    await this.bannerRepository.softDelete(id);

    const lastOrderBanner = await this.bannerRepository.findLastOrderBanner();

    if (lastOrderBanner) {
      return await this.bannerRepository.decrementBannersOrder(
        banner.order,
        lastOrderBanner.order,
        false,
        true
      );
    }
  }

  async find(id: number) {
    const banner = await this.bannerRepository.findOne({
      filters: { id: id },
    });

    if (!banner) {
      throw new NotFoundException({
        message: 'Banner not found',
      });
    }

    return banner;
  }

  async reorder({ banners }: ReorderBannerDto) {
    await this.bannerRepository.reorder(banners);
  }
}
