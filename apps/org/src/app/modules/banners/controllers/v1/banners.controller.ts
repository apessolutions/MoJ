import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BannersService } from '../../services/banners.service';
import { BannerTransformer } from '../../transformers/banners.transformer';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { IResponse } from '@./common/types/response.type';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import {
  BannerDto,
  CreateBannerDto,
  ReorderBannerDto,
  UpdateBannerDto,
} from '@./contract';
import { BannerPermission } from '@./role/types/permission-type.type';

@ApiTags('Banners')
@ControllerDecorator('v1', 'banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly bannerTransformer: BannerTransformer
  ) {}

  @AdminAuth([BannerPermission.LIST])
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const banners = await this.bannersService.findAll();
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapArrToDto(banners),
      HttpStatus.OK
    );
  }

  @AdminAuth([BannerPermission.VIEW])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const banner = await this.bannersService.find(+id);
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(banner),
      HttpStatus.OK
    );
  }

  @AdminAuth([BannerPermission.ADD])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createBannerDto: CreateBannerDto
  ): Promise<IResponse<BannerDto>> {
    const banner = await this.bannersService.create(createBannerDto);
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(banner),
      HttpStatus.CREATED
    );
  }

  @AdminAuth([BannerPermission.EDIT])
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto
  ): Promise<IResponse<BannerDto>> {
    const banner = await this.bannersService.update(+id, updateBannerDto);
    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(banner),
      HttpStatus.OK
    );
  }

  @AdminAuth([BannerPermission.DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('id') id: string): Promise<IResponse<object>> {
    await this.bannersService.delete(+id);
    return ResponseGenerator.generateResourceFormat({}, HttpStatus.OK);
  }

  @AdminAuth([BannerPermission.EDIT])
  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id') id: string) {
    const banner = await this.bannersService.toggleStatus(+id);

    return ResponseGenerator.generateResourceFormat(
      this.bannerTransformer.mapToDto(banner),
      HttpStatus.OK
    );
  }

  @AdminAuth([BannerPermission.EDIT])
  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() reorderDto: ReorderBannerDto) {
    await this.bannersService.reorder(reorderDto);
    return ResponseGenerator.generateResourceFormat({});
  }
}
