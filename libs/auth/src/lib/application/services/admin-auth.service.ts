import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { Transactional } from 'typeorm-transactional';

import { AdminRepository } from '../../../../../admin/src/lib/application/ports/admin.repository';
import { LoginFailedEvent } from '../../../../../auth-log/src/lib/events/login-failed.event';
import { LoginSuccessfulEvent } from '../../../../../auth-log/src/lib/events/login-successful.event';
import { CodeService } from '../../../../../code/src/lib/application/services/code.service';
import { MailService } from '../../../../../mail/src/lib/mail.service';
import { AuthConfig } from '../../config/auth-config.type';
import { AdminJwtPayloadType } from '../../strategies/types/jwt-payload.type';

import { BaseAuthService } from './base-auth.service';
import { SessionService } from 'libs/session/src/lib/application/services/session.service';

import { Admin } from '@./admin/domain/admin';
import { TokenTypeEnum } from '@./auth/enums/token-type.enum';
import { CodeTypeEnum } from '@./code/enums/code-type.enum';
import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { ContextProvider } from '@./common/providers/context.provider';
import { NullableType } from '@./common/types/nullable.type';
import {
  AuthAdminChangePasswordDto,
  AuthAdminEmailLoginDto,
  AuthAdminForgotPasswordDto,
  AuthAdminResetPasswordDto,
  AuthAdminUpdateProfileDto,
  AuthAdminVerifyForgetPasswordOtpDto,
} from '@./contract';

@Injectable()
export class AdminAuthService extends BaseAuthService {
  constructor(
    jwtService: JwtService,
    configService: ConfigService<AuthConfig>,
    sessionService: SessionService,
    protected mailService: MailService,
    private adminRepository: AdminRepository,
    private eventEmitter: EventEmitter2,
    private codeService: CodeService
  ) {
    super(jwtService, configService, sessionService);
  }

  async login(loginDto: AuthAdminEmailLoginDto) {
    const admin = await this.adminRepository.findOne({
      email: loginDto.email,
    });

    if (!admin) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid email or password',
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      admin.password
    );

    if (!isValidPassword) {
      this.eventEmitter.emit(
        LoginFailedEvent.event,
        new LoginFailedEvent(admin.id, UserTypeEnum.ADMIN)
      );
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid email or password',
      });
    }

    if (admin.status === false) {
      this.eventEmitter.emit(
        LoginFailedEvent.event,
        new LoginFailedEvent(admin.id, UserTypeEnum.ADMIN)
      );
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Admin blocked please reach out to the administrator',
      });
    }

    this.eventEmitter.emit(
      LoginSuccessfulEvent.event,
      new LoginSuccessfulEvent(admin.id, UserTypeEnum.ADMIN)
    );
    const { token, tokenExpires } = await this.getTokensData(
      {
        id: admin.id,
      },
      TokenTypeEnum.ADMIN
    );

    return {
      token,
      tokenExpires,
      admin,
    };
  }

  async me(adminJwtPayload: AdminJwtPayloadType): Promise<NullableType<Admin>> {
    const session = await this.sessionService.findOneOrFail({
      id: adminJwtPayload.sessionId,
      userId: adminJwtPayload.id,
      userType: UserTypeEnum.ADMIN,
    });

    const admin = await this.adminRepository.findOne({
      id: adminJwtPayload.id,
    });

    if (!admin) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid email or password',
      });
    }

    return admin;
  }

  async forgetPassword(dto: AuthAdminForgotPasswordDto): Promise<void> {
    const admin = await this.adminRepository.findOne({
      email: dto.email,
    });

    if (!admin) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    const code = await this.codeService.create({
      codeType: CodeTypeEnum.FORGET_OTP,
      userId: admin.id,
      userType: UserTypeEnum.ADMIN,
    });

    await this.mailService.forgotPassword({
      to: admin.email,
      data: {
        code: code.code,
      },
    });
  }

  async resetPassword(dto: AuthAdminResetPasswordDto): Promise<void> {
    const admin = await this.adminRepository.findOne({
      email: dto.email,
    });

    if (!admin) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailNotExists',
        },
      });
    }

    await this.codeService.verifyCode({
      code: dto.code,
      codeType: CodeTypeEnum.FORGET_OTP,
      userId: admin.id,
      userType: UserTypeEnum.ADMIN,
    });

    admin.password = dto.password;
    await this.adminRepository.update(admin);

    await this.codeService.deleteCode({
      code: dto.code,
      codeType: CodeTypeEnum.FORGET_OTP,
      userId: admin.id,
      userType: UserTypeEnum.ADMIN,
    });
  }

  async changePassword(admin: Admin, dto: AuthAdminChangePasswordDto) {
    const isValidOldPassword = await bcrypt.compare(
      dto.oldPassword,
      admin.password
    );

    if (!isValidOldPassword) {
      throw new UnprocessableEntityException({
        errors: {
          oldPassword: 'Old password is invalid',
        },
      });
    }

    admin.password = dto.password;
    await this.adminRepository.update(admin);
    return admin;
  }

  async signOut() {
    const admin = ContextProvider.getAuthAdmin();

    if (!admin) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
      });
    }

    // TODO: Implement logout logic

    return;
  }

  @Transactional()
  async updateProfile(admin: Admin, dto: AuthAdminUpdateProfileDto) {
    if (dto.email) {
      const emailAdmin = await this.adminRepository.findOne({
        email: dto.email,
      });

      if (emailAdmin && emailAdmin.id !== admin.id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            email: 'Email already exists',
          },
        });
      }
    }
    Object.assign(admin, dto);
    await this.adminRepository.update(admin);
    return admin;
  }

  async verifyForgetPasswordCode(dto: AuthAdminVerifyForgetPasswordOtpDto) {
    const admin = await this.adminRepository.findOne({
      email: dto.email,
    });

    if (!admin) {
      throw new UnprocessableEntityException({
        errors: {
          email: 'Email Not Found',
        },
      });
    }
    await this.codeService.verifyCode({
      code: dto.code,
      codeType: CodeTypeEnum.FORGET_OTP,
      userId: admin.id,
      userType: UserTypeEnum.ADMIN,
    });
  }
}
