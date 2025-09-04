import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CampaignTransformer } from '../../transformers/campaigns.transformer';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { CampaignService } from '@./campaigns/application/services/campaigns.service';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import { CreateCampaignDto, PageOptionsDto } from '@./contract';
import { CampaignPermission } from '@./role/types/permission-type.type';

@ApiTags('Campaigns')
@ControllerDecorator('v1', 'campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly bannerTransformer: CampaignTransformer
  ) {}

  @AdminAuth([CampaignPermission.ADD])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    const campaign = await this.campaignService.create(createCampaignDto);
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(campaign),
      HttpStatus.CREATED
    );
  }

  @AdminAuth([CampaignPermission.DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.campaignService.delete(+id);
    return ResponseGenerator.generateResourceFormat({}, HttpStatus.NO_CONTENT);
  }

  @AdminAuth([CampaignPermission.VIEW])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const campaign = await this.campaignService.findOne(+id);
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(campaign),
      HttpStatus.OK
    );
  }

  @AdminAuth([CampaignPermission.LIST])
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptions: PageOptionsDto) {
    const result = await this.campaignService.findAll({
      filters: {},
      config: { skip: pageOptions.skip, take: pageOptions.limit },
    });
    return ResponseGenerator.generatePaginationFormat(
      this.bannerTransformer.mapArrToDto(result.data),
      result.count,
      pageOptions,
      HttpStatus.OK
    );
  }
}
