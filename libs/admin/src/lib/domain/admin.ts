import { Role } from '@./role/domain/role';

export class Admin {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  status!: boolean;
  isSuper!: boolean;
  roles!: Role[];
}
