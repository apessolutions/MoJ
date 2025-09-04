import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AdminAuthService } from '../application/services/admin-auth.service';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { AdminJwtPayloadType } from '../strategies/types/jwt-payload.type';

import { ContextProvider } from 'libs/common/src/lib/providers/context.provider';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  private logger: Logger = new Logger(AdminAuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AdminAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AdminJwtPayloadType = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('auth.secret', { infer: true }),
        }
      );
      if (payload.tokenType != TokenTypeEnum.ADMIN) {
        throw new UnauthorizedException();
      }

      const admin = await this.authService.me(payload);
      if (!admin) return false;
      ContextProvider.setAuthAdmin(admin);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-ignore
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
