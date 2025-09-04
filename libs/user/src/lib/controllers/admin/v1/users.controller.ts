import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import {
  AdminControllerDecorator,
  AdminTags,
} from '@./common/decorators/admin-controller.decorator';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import { Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserPermission } from '@./roles/types/permission-type.type';
import { UserQueryDto } from '@./users/dto/admin/v1/user-query.dto';
import { UserService } from '@./users/services/user.service';
import { UserTransformer } from '@./users/transformers/user.transformer';

@AdminTags('Admins')
@AdminControllerDecorator('v1', 'admins')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly transformer: UserTransformer
  ) {}

  @AdminAuth([UserPermission.VIEW])
  @Get('find-one')
  @HttpCode(HttpStatus.OK)
  async findOne(@Query() userQueryDto: UserQueryDto) {
    const result = await this.usersService.findOne(userQueryDto);
    return ResponseGenerator.generateResourceFormat(
      this.transformer.mapToDto(result),
      HttpStatus.OK
    );
  }
}
