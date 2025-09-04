import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../../services/users.service';
import { UserTransformer } from '../../transformers/users.transformer';

import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { IResponse } from '@./common/types/response.type';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import {
  CreateUserDto,
  PageOptionsDto,
  UpdateUserDto,
  UserDto,
} from '@./contract';
import { UserPermission } from '@./role/types/permission-type.type';

@ApiTags('Users')
@ControllerDecorator('v1', 'users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userTransformer: UserTransformer
  ) {}

  @AdminAuth([UserPermission.ADD])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createDto: CreateUserDto
  ): Promise<IResponse<UserDto>> {
    const role = await this.userService.create(createDto);
    return ResponseGenerator.generateResourceFormat(
      this.userTransformer.mapToDto(role)
    );
  }

  @AdminAuth([UserPermission.EDIT])
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateUserDto
  ): Promise<IResponse<UserDto>> {
    const user = await this.userService.update(+id, updateDto);
    return ResponseGenerator.generateResourceFormat(
      this.userTransformer.mapToDto(user)
    );
  }

  @AdminAuth([UserPermission.BLOCK])
  @Put(':id/block')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: number): Promise<IResponse<object>> {
    await this.userService.delete(+id);
    return ResponseGenerator.generateResourceFormat({});
  }

  @AdminAuth([UserPermission.BLOCK])
  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  public async restore(@Param('id') id: number): Promise<IResponse<object>> {
    await this.userService.restore(+id);
    return ResponseGenerator.generateResourceFormat({});
  }

  @AdminAuth([UserPermission.LIST])
  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const result = await this.userService.findAll({
      config: pageOptionsDto,
      filters: {},
    });
    return ResponseGenerator.generatePaginationFormat(
      this.userTransformer.mapArrToDto(result.data),
      result.count,
      pageOptionsDto,
      HttpStatus.OK
    );
  }

  @AdminAuth([UserPermission.VIEW])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: number): Promise<IResponse<UserDto>> {
    const user = await this.userService.findOne({ id });
    return ResponseGenerator.generateResourceFormat(
      this.userTransformer.mapToDto(user)
    );
  }
}
