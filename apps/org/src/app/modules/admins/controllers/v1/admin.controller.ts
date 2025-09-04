import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AdminService } from 'libs/admin/src/lib/application/services/admin.service';
import { AdminAuth } from 'libs/auth/src/lib/decorators/admin-auth.decorator';
import { ControllerDecorator } from 'libs/common/src/lib/decorators/controller.decorator';
import {
  IPaginationResponse,
  IResponse,
} from 'libs/common/src/lib/types/response.type';
import { ResponseGenerator } from 'libs/common/src/lib/utils/response-generator.utils';
import { AdminTransformer } from '../../transformers/admin.transformer';

import {
  AdminDto,
  CreateAdminDto,
  PageOptionsDto,
  UpdateAdminDto,
} from '@./contract';
import { AdminPermission } from '@./role/types/permission-type.type';

@ApiTags('Admins')
@ControllerDecorator('v1', 'admins')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly transformer: AdminTransformer
  ) {}

  @AdminAuth([AdminPermission.ADD])
  @Post('')
  @HttpCode(HttpStatus.OK)
  public async createAdmin(
    @Body() createDto: CreateAdminDto
  ): Promise<IResponse<AdminDto>> {
    const admin = await this.service.create(createDto);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(admin)
    );
  }

  @AdminAuth([AdminPermission.LIST])
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async getAdmins(
    @Query() paginationOptions: PageOptionsDto
  ): Promise<IPaginationResponse<AdminDto>> {
    const { data, count } = await this.service.findAll(paginationOptions);
    return ResponseGenerator.generatePaginationFormat(
      this.transformer.mapArrToDto(data),
      count,
      paginationOptions
    );
  }

  @AdminAuth([AdminPermission.LIST])
  @Get('list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<IResponse<AdminDto[]>> {
    const data = await this.service.list();
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapArrToDto(data)
    );
  }

  @AdminAuth([AdminPermission.VIEW])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getAdmin(@Param('id') id: number): Promise<IResponse<AdminDto>> {
    const admin = await this.service.findById(id);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(admin)
    );
  }

  @AdminAuth([AdminPermission.EDIT])
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAdminDto
  ): Promise<IResponse<AdminDto>> {
    const admin = await this.service.updateAdmin(id, updateDto);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(admin)
    );
  }

  @AdminAuth([AdminPermission.DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('id') id: number): Promise<IResponse<{}>> {
    await this.service.delete(id);
    return ResponseGenerator.generateResourceFormat({});
  }
}
