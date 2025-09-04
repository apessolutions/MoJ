import { Injectable } from '@nestjs/common';

import { Admin } from '@./admin/domain/admin';
import { AdminInfoDto } from '@./contract';

@Injectable()
export class AuthTransformer {
  mapToDto(admin: Admin) {
    return new AdminInfoDto(admin);
  }

  mapArrToDto(admins: Admin[]) {
    return admins.map((admin) => this.mapToDto(admin));
  }
}
