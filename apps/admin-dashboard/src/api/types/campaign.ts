import { ApiPaginatedResponse, ApiResponse } from 'src/types/response';
import { IPaginationOptions } from '../../../../../libs/common/src/lib/types/pagination-options';
import {
  CampaignDto,
  CreateCampaignDto,
} from '../../../../../libs/contract/src/lib/admin/v1/campaign';

// =========================== Create Campaign ==============================
export type CreateCampaignPayload = CreateCampaignDto;
export type CreateCampaignResponse = ApiResponse<CampaignDto>;
// =========================== Delete Campaign ==============================
export type DeleteCampaignResponse = ApiResponse<void>;
// ========================== Get Campaigns =================================
export type GetCampaignsResponse = ApiPaginatedResponse<CampaignDto>;
export type GetCampaignsOption = Partial<IPaginationOptions>;
// =========================== Get Campaign =================================
export type GetCampaignResponse = ApiResponse<CampaignDto>;
