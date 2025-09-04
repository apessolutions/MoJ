import { NullableType } from '@./common/types/nullable.type';

export interface IFirebaseNotification {
  title: string;
  message: string;
  additionalData: NullableType<JSON>;
  deviceTokens: string[];
}
