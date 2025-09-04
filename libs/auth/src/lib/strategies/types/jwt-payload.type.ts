import { TokenTypeEnum } from '../../enums/token-type.enum';

export type JwtPayloadType = {
  id: number;
  sessionId: number;
  iat: number;
  exp: number;
  tokenType: TokenTypeEnum;
};

export type AdminJwtPayloadType = JwtPayloadType;
export type UserJwtPayloadType = JwtPayloadType;
export type GuestJwtPayloadType = JwtPayloadType & {
  deviceId: string;
};
