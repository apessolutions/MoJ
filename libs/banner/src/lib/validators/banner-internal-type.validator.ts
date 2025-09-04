import { BadRequestException } from '@nestjs/common';
import { ValidationHandler } from '../../../../common/src/lib/utils/validation-runner.utils';
import { BannerInternalType } from '../enums/banner-type.enum';

export class BannerInternalTypeValidator extends ValidationHandler {
  constructor(
    private readonly type: BannerInternalType,
    private readonly linkValue: string
  ) {
    super(false);
  }

  typeToRepoMapper = {
    // [BannerInternalType.EVENT]: this.,
  };

  getRepoAndData(type: BannerInternalType, id: number) {
    // const repo = this.typeToRepoMapper[type];

    let data;
    switch (type) {
      case BannerInternalType.EVENT:
        data = { id };
        break;
    }

    // return { repo, data };
  }

  async run(): Promise<void> {
    const id = parseInt(this.linkValue);

    if (isNaN(id)) {
      throw new BadRequestException({
        message: 'Internal link value is invalid',
      });
    }

    // const { repo, data } = this.getRepoAndData(this.type, id);

    // const record = await repo.findOne(data);

    // if (!record) {
    //   throw new NotFoundException({
    //     message: 'Internal resource is not found',
    //   });
    // }
  }
}
