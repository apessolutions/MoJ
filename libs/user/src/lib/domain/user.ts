import { GenderEnum } from '@./common/enums/gender.enum';
import { NullableType } from '@./common/types/nullable.type';
import { FileType } from '../../../../file/src/lib/domain/file';
import { MaybeType } from '@./common/types/maybe.type';

export class User {
  id!: number;
  firstName?: NullableType<string>;
  lastName?: NullableType<string>;
  userName?: NullableType<string>;
  gender?: NullableType<GenderEnum>;
  email?: NullableType<string>;
  photoId?: NullableType<number>;
  photo?: NullableType<FileType>;
  phoneNumber!: string;
  dateOfBirth?: NullableType<string>;
  status!: boolean;
  deletedAt!: MaybeType<Date>;
}
