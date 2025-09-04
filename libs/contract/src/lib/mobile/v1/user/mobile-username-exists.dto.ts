import { IsNotEmpty, IsString } from 'class-validator';

export class MobileUsernameExistsDto {
  @IsString()
  @IsNotEmpty()
  userName!: string;
}
