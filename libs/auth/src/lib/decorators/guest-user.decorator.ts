import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const GUEST_USER_KEY = 'guest_user_key';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PassGuestUser = (): CustomDecorator =>
  SetMetadata(GUEST_USER_KEY, true);
