import { Injectable } from '@nestjs/common';

import { UserDto } from '@./contract';
import { User } from '@./user/domain/user';

@Injectable()
export class UserTransformer {
  mapToDto(user: User) {
    return new UserDto(user);
  }

  mapArrToDto(users: User[]) {
    return users.map((user) => this.mapToDto(user));
  }
}
