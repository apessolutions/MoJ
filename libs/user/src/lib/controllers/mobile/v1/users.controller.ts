import { UserAuth } from '@./auth/decorators/user-auth.decorator';
import {
  MobileControllerDecorator,
  MobileTags,
} from '@./common/decorators/mobile-controller.decorator';
import { ContextProvider } from '@./common/providers';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import { Post, Body, Patch, HttpStatus, HttpCode } from '@nestjs/common';
import { UserDto } from '@./users/dto/admin/v1/user.dto';
import { MobileUpdateProfilePictureDto } from '@./users/dto/mobile/v1/mobile-update-profile-picture.dto';
import { MobileUpdateProfileDto } from '@./users/dto/mobile/v1/mobile-update-profile.dto';
import { MobileUsernameExistsDto } from '@./users/dto/mobile/v1/mobile-username-exists.dto';
import { UserService } from '@./users/services/user.service';

@MobileTags('Users')
@MobileControllerDecorator('v1', 'users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @UserAuth()
  @Post('username')
  @HttpCode(HttpStatus.OK)
  async usernameExists(@Body() dto: MobileUsernameExistsDto) {
    await this.usersService.userNameExists(dto.userName);
    return ResponseGenerator.generateResourceFormat({});
  }

  @UserAuth()
  @Patch()
  async update(@Body() updateDto: MobileUpdateProfileDto) {
    const user = await this.usersService.update(
      ContextProvider.getAuthUser()?.id!,
      updateDto
    );
    return ResponseGenerator.generateResourceFormat(new UserDto(user));
  }

  @UserAuth()
  @Patch('photo')
  async uploadPhoto(@Body() updateDto: MobileUpdateProfilePictureDto) {
    const user = await this.usersService.update(
      ContextProvider.getAuthUser()?.id!,
      updateDto
    );
    return ResponseGenerator.generateResourceFormat(new UserDto(user));
  }
}
