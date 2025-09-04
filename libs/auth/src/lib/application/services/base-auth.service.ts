import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';

import { AuthConfig } from '../../config/auth-config.type';
import { TokenTypeEnum } from '../../enums/token-type.enum';

import { SessionService } from 'libs/session/src/lib/application/services/session.service';
import { UserTypeEnum } from '@./common/enums/user-type.enum';

@Injectable()
export class BaseAuthService {
  constructor(
    protected jwtService: JwtService,
    protected configService: ConfigService<AuthConfig>,
    protected sessionService: SessionService
  ) {}

  protected getUserType(type: TokenTypeEnum) {
    switch (type) {
      case TokenTypeEnum.ADMIN:
        return UserTypeEnum.ADMIN;
      case TokenTypeEnum.USER:
        return UserTypeEnum.USER;
      default:
        return UserTypeEnum.USER;
    }
  }

  protected async getTokensData(data: any, type: TokenTypeEnum) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const session = await this.sessionService.create({
      userId: data.id,
      userType: this.getUserType(type),
      expiresAfter: tokenExpiresIn,
    });

    const token = await this.jwtService.signAsync(
      {
        ...data,
        sessionId: session.id,
        tokenType: type,
        expiresIn: tokenExpiresIn,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      }
    );

    return {
      token,
      tokenExpires,
    };
  }
}
