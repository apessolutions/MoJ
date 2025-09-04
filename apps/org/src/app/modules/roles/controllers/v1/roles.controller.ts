import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleService } from '../../../../../../../../libs/role/src/lib/application/services/role.service';
import { RoleTransformer } from '../../transformers/roles.transformer';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { RolePermission } from '@./role/types/permission-type.type';
import {
  CreateRoleDto,
  PageOptionsDto,
  RoleDto,
  UpdateRoleDto,
} from '@./contract';
import { IResponse } from '@./common/types/response.type';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';

@ApiTags('Roles')
@ControllerDecorator('v1', 'roles')
export class RolesController {
  constructor(
    private readonly service: RoleService,
    private readonly transformer: RoleTransformer
  ) {}

  @AdminAuth([RolePermission.ADD])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createRole(
    @Body() createDto: CreateRoleDto
  ): Promise<IResponse<RoleDto>> {
    const role = await this.service.create(createDto);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(role)
    );
  }

  @AdminAuth([RolePermission.LIST])
  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const result = await this.service.findAll(pageOptionsDto);
    return ResponseGenerator.generatePaginationFormat(
      this.transformer.mapArrToDto(result.data),
      result.count,
      pageOptionsDto,
      HttpStatus.OK
    );
  }

  @AdminAuth([RolePermission.LIST])
  @Get('list')
  @HttpCode(HttpStatus.OK)
  public async list() {
    const data = await this.service.list();
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapArrToDto(data)
    );
  }

  @AdminAuth([RolePermission.VIEW])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: number): Promise<IResponse<RoleDto>> {
    const role = await this.service.findById(id);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(role)
    );
  }

  @AdminAuth([RolePermission.EDIT])
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateRoleDto
  ): Promise<IResponse<RoleDto>> {
    const role = await this.service.update(+id, updateDto);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(role)
    );
  }

  @AdminAuth([RolePermission.DELETE])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: number): Promise<IResponse<{}>> {
    await this.service.delete(+id);
    return ResponseGenerator.generateResourceFormat({});
  }
}
