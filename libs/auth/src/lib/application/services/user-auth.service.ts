import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isDefined } from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { AuthConfig } from '../../config/auth-config.type';
import { TokenTypeEnum } from '../../enums/token-type.enum';
// import { AuthConfig } from '../../config';
// import { TokenTypeEnum } from '../../enums';
import { UserJwtPayloadType } from '../../strategies/types/jwt-payload.type';

import { BaseAuthService } from './base-auth.service';

import { ContextProvider } from 'libs/common/src/lib/providers/context.provider';
import { ConnekioService } from '@./common/providers/sms/connekio.provider';
import { TwilioOTPService } from '@./common/providers/twilio/services/twilio-otp.service';
import { OTPService } from '@./common/services/otp.service';
import { NullableType } from '@./common/types/nullable.type';
import { FindConfig } from '@./common/types/query.type';
import { DateOperations } from '@./common/utils/date-operation.utils';
import {
  MobileContinueAsAGuestDto,
  MobileLogoutDto,
  MobileSendOTPDto,
  MobileUpdateFcmTokenDto,
  MobileUpdateUserAddressDto,
  MobileVerifyOTPDto,
} from '@./contract';
import { UserRepository } from '@./user/application/ports//user.repository';
import { UserAddressRepository } from '@./user/application/ports//user-address.repository';
import { UserDeviceRepository } from '@./user/application/ports//user-device.repository';
import { PhoneNumberRepository } from '@./user/application/ports/phone-number.repository';
import { User } from '@./user/domain/user';
import { UserAddress } from '@./user/domain/user-address';
import { SessionService } from '@./session/application/services/session.service';
import { UserTypeEnum } from '@./common/enums/user-type.enum';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

@Injectable()
export class UserAuthService extends BaseAuthService {
  constructor(
    jwtService: JwtService,
    configService: ConfigService<AuthConfig>,
    sessionService: SessionService,
    private phoneNumberRepository: PhoneNumberRepository,
    private conneckioService: ConnekioService,
    private otpService: OTPService,
    private twilioService: TwilioOTPService,
    private userRepository: UserRepository,
    private userDeviceRepository: UserDeviceRepository,
    private userAddressRepository: UserAddressRepository
  ) {
    super(jwtService, configService, sessionService);
  }

  async sendOTP(dto: MobileSendOTPDto): Promise<void> {
    const otpCode = await this.otpService.generateOTP();

    let phoneNumber = await this.phoneNumberRepository.findOne({
      phoneNumber: dto.phoneNumber,
    });

    if (!phoneNumber) {
      phoneNumber = await this.phoneNumberRepository.create(
        dto.phoneNumber,
        otpCode
      );
    } else {
      // if phone exists and not same email update code created at
      if (
        phoneNumber.verificationCode != otpCode ||
        DateOperations.timePassedDuration(phoneNumber.codeCreatedAt!, {
          minutes: 10,
        })
      ) {
        phoneNumber.verificationCode = otpCode;
        phoneNumber.codeCreatedAt = new Date(Date.now());
        await this.phoneNumberRepository.update(phoneNumber);
      }
    }

    const parsedPhoneNumber = phoneNumberUtil.parseAndKeepRawInput(
      phoneNumber.phoneNumber,
      ''
    );
    const countryCode =
      phoneNumberUtil.getRegionCodeForNumber(parsedPhoneNumber);

    switch (countryCode) {
      case 'EG':
        this.conneckioService.sendSMS(
          phoneNumber.phoneNumber!,
          `OTP is ${phoneNumber?.verificationCode}. It will be valid for 10 mins. Kindly don't share it with anyone!`
        );
        break;
      default:
        await this.twilioService.sendOTP(phoneNumber?.phoneNumber!);
    }
  }

  async verifyOTP(dto: MobileVerifyOTPDto) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      phoneNumber: dto.phoneNumber,
    });

    if (!phoneNumber) {
      throw new NotFoundException({
        message: 'Phone number not found',
      });
    }

    if (phoneNumber.verificationCode != dto.code)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid OTP',
      });

    if (
      phoneNumber.codeCreatedAt &&
      DateOperations.timePassedDuration(phoneNumber.codeCreatedAt, {
        minutes: 10,
      })
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'OTP is expired',
      });
    }

    let user = await this.userRepository.findOne({
      phoneNumber: phoneNumber.phoneNumber,
    });

    if (!user) {
      user = await this.userRepository.create({
        phoneNumber: phoneNumber.phoneNumber,
        status: true,
      });
    }

    await this.phoneNumberRepository.delete({
      id: phoneNumber.id,
    });
    const { token, tokenExpires } = await this.getTokensData(
      user,
      TokenTypeEnum.USER
    );
    return {
      token,
      tokenExpires,
      user,
    };
  }

  async continueAsGuest(dto: MobileContinueAsAGuestDto) {
    const { token, tokenExpires } = await this.getTokensData(
      { deviceId: dto.deviceId },
      TokenTypeEnum.GUEST
    );
    return {
      token,
      tokenExpires,
    };
  }

  async signOut(dto: MobileLogoutDto) {
    await this.userDeviceRepository.delete([
      {
        deviceId: dto.deviceId,
      },
    ]);
  }

  async getProfile() {
    const user = ContextProvider.getAuthUser();
    const profile = await this.userRepository.findOne(
      { id: user?.id },
      { withDeleted: true }
    );
    if (!profile) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }
    return profile;
  }

  async updateFcmToken(dto: MobileUpdateFcmTokenDto) {
    const userId = ContextProvider.getAuthUser()!.id;

    await this.userDeviceRepository.delete([
      {
        fcmToken: dto.fcmToken,
      },
      {
        deviceId: dto.deviceId,
      },
    ]);

    await this.userDeviceRepository.create({
      deviceId: dto.deviceId,
      deviceType: dto.deviceType,
      fcmToken: dto.fcmToken,
      userId,
    });
  }

  async updateAddress(dto: MobileUpdateUserAddressDto) {
    let address: NullableType<UserAddress> =
      await this.userAddressRepository.findGuestAddress(dto.deviceId);

    if (!isDefined(address)) {
      address = await this.userAddressRepository.create({
        ...dto,
      });
    } else {
      Object.keys(dto).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        address[key] = dto[key];
      });
      await this.userAddressRepository.update(address);
    }
  }

  async me(
    userJwtPayload: UserJwtPayloadType,
    config: FindConfig<User>
  ): Promise<NullableType<User>> {
    const session = await this.sessionService.findOneOrFail({
      id: userJwtPayload.sessionId,
      userId: userJwtPayload.id,
      userType: UserTypeEnum.USER,
    });

    const user = await this.userRepository.findOne(
      {
        id: userJwtPayload.id,
      },
      config
    );

    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid email or password',
      });
    }

    if (!user.status) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: 'User is blocked contact administrator!',
      });
    }

    return user;
  }

  async findUserAddress(userId: number) {
    return await this.userAddressRepository.findUserAddress(userId);
  }

  async findGuestAddress(deviceId: string) {
    return await this.userAddressRepository.findGuestAddress(deviceId);
  }
}
