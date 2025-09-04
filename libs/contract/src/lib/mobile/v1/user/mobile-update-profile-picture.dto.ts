import { IsNumber } from 'class-validator';
import { FileEntity } from '../../../../../../file/src/lib/infrastructure/persistence/entities/file.entity';
import { IsExists } from '../../../../../../database/src/lib/utils/validators/is-exists.validator';

export class MobileUpdateProfilePictureDto {
  @IsNumber()
  @IsExists(
    {
      table: FileEntity.name,
      column: 'id',
    },
    {
      message: 'Photo should be uploaded first!',
    }
  )
  photoId!: number;
}
