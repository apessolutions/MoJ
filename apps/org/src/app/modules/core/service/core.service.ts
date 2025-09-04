import { Injectable } from '@nestjs/common';

import { permissions } from '@./role/data/permissions.data';

@Injectable()
export class CoreService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  getPermissions() {
    return permissions.map(({ label, permissions }, index) => ({
      id: index,
      name: label,
      permissions: permissions.map((p, index) => ({
        id: index,
        label: p.label,
        permission: p.name,
      })),
    }));
  }
}
