import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const PASS_DELETED_USER_KEY = 'pass_deleted_user_key';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PassDeletedUser = (): CustomDecorator =>
  SetMetadata(PASS_DELETED_USER_KEY, true);
