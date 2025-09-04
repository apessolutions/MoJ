/* eslint-disable @nx/enforce-module-boundaries */
import { ApiPaginatedResponse, ApiResponse } from 'src/types/response';

import { RoleDto } from '../../../../../libs/contract/src/lib/admin/v1/role/role.dto';
import { IPaginationOptions } from '../../../../../libs/common/src/lib/types/pagination-options';
import { CreateRoleDto } from '../../../../../libs/contract/src/lib/admin/v1/role/create-role.dto';
import { UpdateRoleDto } from '../../../../../libs/contract/src/lib/admin/v1/role/update-role.dto';

// ========================== Get Roles ====================================
export type GetRolesResponse = ApiPaginatedResponse<RoleDto>;
export type GetRolesOption = Partial<IPaginationOptions>;

// =========================== Get Roles List ==============================
export type GetRolesListResponse = ApiResponse<RoleDto[]>;
export type GetRolesListOption = Partial<IPaginationOptions>;

// =========================== Create Role ==============================
export type CreateRolePayload = CreateRoleDto;
export type CreateRoleResponse = ApiResponse<RoleDto>;

// =========================== Create Role ==============================
export type UpdateRolePayload = UpdateRoleDto;
export type UpdateRoleResponse = ApiResponse<RoleDto>;

// =========================== Get Role ==============================
export type GetRoleResponse = ApiResponse<RoleDto>;

// =========================== Delete Role ==============================
export type DeleteRoleResponse = ApiResponse<RoleDto>;
