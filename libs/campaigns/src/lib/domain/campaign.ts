import { MaybeType } from '../../../../common/src/lib/types/maybe.type';
import { GenderEnum } from '@./common/enums/gender.enum';

export class Campaign {
  id!: number;
  createdAt: MaybeType<Date>;
  updatedAt: MaybeType<Date>;
  title!: string;
  message!: string;
  minAge!: number | null;
  maxAge!: number | null;
  gender!: GenderEnum[];
}
