import { Injectable } from '@nestjs/common';

import { Admin } from '@./admin/domain/admin';
import { AdminDto } from '@./contract';

@Injectable()
export class AdminTransformer {
  mapToDto(admin: Admin) {
    return new AdminDto(admin);
  }

  mapArrToDto(admins: Admin[]) {
    return admins.map((admin) => this.mapToDto(admin));
  }
}
