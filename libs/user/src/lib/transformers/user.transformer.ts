import { Injectable } from '@nestjs/common';
import { AdminUserDto } from '@./contract';
import { User } from '../domain/user';

@Injectable()
export class UserTransformer {
  mapToDto(user: User) {
    return new AdminUserDto(user);
  }

  mapArrToDto(users: User[]) {
    return users.map((user) => this.mapToDto(user));
  }
}
