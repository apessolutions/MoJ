import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import {
  AdminControllerDecorator,
  AdminTags,
} from '@./common/decorators/admin-controller.decorator';
import { PageOptionsDto } from '@./common/dtos/page-option.dto';
import { IResponse } from '@./common/types/response.type';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
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
import { CreateRoleDto } from '@./roles/dto/v1/create-role.dto';
import { RoleDto } from '@./roles/dto/v1/role.dto';
import { UpdateRoleDto } from '@./roles/dto/v1/update-role.dto';
import { RoleService } from '@./roles/services/role.service';
import { RoleTransformer } from '@./roles/transformers/role.transformer';
import { RolePermission } from '@./roles/types/permission-type.type';

@AdminTags('Roles')
@AdminControllerDecorator('v1', 'roles')
export class RoleController {
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
    return ResponseGenerator.generateResourceFormat(role);
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
