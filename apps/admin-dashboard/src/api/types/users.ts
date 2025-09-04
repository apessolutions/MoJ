/* eslint-disable @nx/enforce-module-boundaries */
import { ApiPaginatedResponse, ApiResponse } from 'src/types/response';

import { UserDto } from '../../../../../libs/contract/src/lib/admin/v1/user/user.dto';
import { IPaginationOptions } from '../../../../../libs/common/src/lib/types/pagination-options';

export type GetUsersResponse = ApiPaginatedResponse<UserDto>;
export type GetUsersOption = Partial<IPaginationOptions>;

export type GetUserResponse = ApiResponse<UserDto>;
