/* eslint-disable @nx/enforce-module-boundaries */
import { ApiPaginatedResponse, ApiResponse } from 'src/types/response';

import { IPaginationOptions } from '../../../../../libs/common/src/lib/types/pagination-options';
import { CreateAdminDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/create-admin.dto';
import { UpdateAdminDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/update-admin.dto';
import { AdminDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/admin.dto';

// ========================== Get Admins ====================================
export type GetAdminsResponse = ApiPaginatedResponse<AdminDto>;
export type GetAdminsOption = Partial<IPaginationOptions>;

// =========================== Get Admins List ==============================
export type GetAdminsListResponse = ApiResponse<AdminDto[]>;
export type GetAdminsListOption = Partial<IPaginationOptions>;

// =========================== Create Admin ==============================
export type CreateAdminPayload = CreateAdminDto;
export type CreateAdminResponse = ApiResponse<AdminDto>;

// =========================== Create Admin ==============================
export type UpdateAdminPayload = UpdateAdminDto;
export type UpdateAdminResponse = ApiResponse<AdminDto>;

// =========================== Get Admin ==============================
export type GetAdminResponse = ApiResponse<AdminDto>;

// =========================== Delete Admin ==============================
export type DeleteAdminResponse = ApiResponse<AdminDto>;
