import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthTransformer } from '../../transformers/auth.transformer';

import { AdminAuthService } from '@./auth/application/services/admin-auth.service';
import { AdminAuth } from '@./auth/decorators/admin-auth.decorator';
import { ControllerDecorator } from '@./common/decorators/controller.decorator';
import { ContextProvider } from '@./common/providers/context.provider';
import { ResponseGenerator } from '@./common/utils/response-generator.utils';
import {
  AuthAdminChangePasswordDto,
  AuthAdminEmailLoginDto,
  AuthAdminForgotPasswordDto,
  AuthAdminResetPasswordDto,
  AuthAdminUpdateProfileDto,
  AuthAdminVerifyForgetPasswordOtpDto,
} from '@./contract';

@ApiTags('Auth')
@ControllerDecorator('v1', 'auth')
export class AuthController {
  constructor(
    private readonly service: AdminAuthService,
    private readonly authTransformer: AuthTransformer
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: AuthAdminEmailLoginDto) {
    const data = await this.service.login(loginDto);
    return ResponseGenerator.generateResourceFormat(
      {
        ...data,
        admin: this.authTransformer.mapToDto(data.admin),
      },
      200
    );
  }

  @HttpCode(200)
  @Post('forget-password')
  async forgetPassword(@Body() forgetDto: AuthAdminForgotPasswordDto) {
    await this.service.forgetPassword(forgetDto);
    return ResponseGenerator.generateResourceFormat({}, 200);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-password')
  async verifyForgetPasswordCode(
    @Body() dto: AuthAdminVerifyForgetPasswordOtpDto
  ) {
    await this.service.verifyForgetPasswordCode(dto);
    return ResponseGenerator.generateResourceFormat({}, HttpStatus.OK);
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() resetDto: AuthAdminResetPasswordDto) {
    await this.service.resetPassword(resetDto);
    return ResponseGenerator.generateResourceFormat({}, 200);
  }

  @AdminAuth()
  @HttpCode(200)
  @Patch('change-password')
  async changePassword(@Body() changeDto: AuthAdminChangePasswordDto) {
    await this.service.changePassword(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ContextProvider.getAuthAdmin()!,
      changeDto
    );
    return ResponseGenerator.generateResourceFormat({}, 200);
  }

  @AdminAuth()
  @HttpCode(200)
  @Post('logout')
  async logout() {
    await this.service.signOut();
    return ResponseGenerator.generateResourceFormat({}, 200);
  }

  @AdminAuth()
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  async updateProfile(@Body() changeDto: AuthAdminUpdateProfileDto) {
    const user = await this.service.updateProfile(
      ContextProvider.getAuthAdmin()!,
      changeDto
    );
    return ResponseGenerator.generateResourceFormat(
      this.authTransformer.mapToDto(user),
      HttpStatus.OK
    );
  }
  @AdminAuth()
  @Get('me')
  async getProfile() {
    const admin = ContextProvider.getAuthAdmin()!;
    return ResponseGenerator.generateResourceFormat(
      this.authTransformer.mapToDto(admin),
      200
    );
  }
}
