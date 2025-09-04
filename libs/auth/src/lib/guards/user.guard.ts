import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { isDefined } from 'class-validator';

import { UserAuthService } from '../application/services/user-auth.service';
import { GUEST_USER_KEY } from '../decorators/guest-user.decorator';
import { PASS_DELETED_USER_KEY } from '../decorators/pass-deleted-user.decorator';
import { TokenTypeEnum } from '../enums/token-type.enum';
import {
  GuestJwtPayloadType,
  UserJwtPayloadType,
} from '../strategies/types/jwt-payload.type';

import { ContextProvider } from 'libs/common/src/lib/providers/context.provider';
import { NullableType } from 'libs/common/src/lib/types/nullable.type';
import { UserAddress } from 'libs/user/src/lib/domain/user-address';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private logger: Logger = new Logger(UserAuthGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: UserAuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const passGuestUser =
      this.reflector.getAllAndOverride<boolean>(GUEST_USER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (passGuestUser && !token) return true;

    const passDeletedUser =
      this.reflector.getAllAndOverride<boolean>(PASS_DELETED_USER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserJwtPayloadType | GuestJwtPayloadType =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('auth.secret', { infer: true }),
        });

      let address: NullableType<UserAddress> = null;
      if (payload.tokenType === TokenTypeEnum.GUEST) {
        if (!passGuestUser) {
          throw new UnauthorizedException();
        }
        address = await this.authService.findGuestAddress(
          (payload as GuestJwtPayloadType).deviceId
        );
      } else if (payload.tokenType === TokenTypeEnum.USER) {
        const user = await this.authService.me(payload as UserJwtPayloadType, {
          withDeleted: true,
        });

        if (!user || (!passDeletedUser && isDefined(user.deletedAt)))
          throw new UnauthorizedException();
        ContextProvider.setAuthUser(user);
        address = await this.authService.findUserAddress(
          (payload as UserJwtPayloadType).id
        );
      }
      if (isDefined(address)) {
        ContextProvider.setUserAddress(address);
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
