/* eslint-disable @nx/enforce-module-boundaries */
import { ApiPaginatedResponse, ApiResponse } from 'src/types/response';

import { CreateBannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/create-banner.dto';
import { UpdateBannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/update-banner.dto';
import { IPaginationOptions } from '../../../../../libs/common/src/lib/types/pagination-options';
import { BannerQueryDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/banner-query.dto';
import { IBanner } from 'src/types/banner';
import { ReorderBannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/reorder-banner.dto';

// ========================== Create Banner ====================================
export type CreateBannerPayload = CreateBannerDto;
export type CreateBannerResponse = ApiResponse<IBanner>;

// ========================== Update Banner ====================================
export type UpdateBannerPayload = UpdateBannerDto;
export type UpdateBannerResponse = ApiResponse<IBanner>;

// ========================== Delete Banner ====================================
export type DeleteBannerResponse = ApiResponse<void>;

// ========================== Get Banner ====================================
export type GetBannerResponse = ApiResponse<IBanner>;

// ========================== Get Banners ====================================
export type GetBannersOption = Partial<IPaginationOptions & BannerQueryDto>;
export type GetBannersResponse = ApiResponse<IBanner[]>;

// ========================== Toggle Banner Status ============================
export type ToggleBannerStatusResponse = ApiResponse<IBanner>;
// ========================== Reorder Banner ============================
export type ReorderBannerPayload = ReorderBannerDto;
export type ReorderBannerResponse = ApiResponse<void>;
