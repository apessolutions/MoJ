import { ApiResponse } from 'src/types/response';
import { PermissionsDto } from '../../../../../libs/role/src/lib/data/permissions.data';

export type GetPermissionsListResponse = ApiResponse<PermissionsDto[]>;
