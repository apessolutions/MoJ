import { endpoints } from 'src/utils/axios';

import {
  CreateCampaignPayload,
  CreateCampaignResponse,
  DeleteCampaignResponse,
  GetCampaignResponse,
  GetCampaignsOption,
  GetCampaignsResponse,
} from '../types/campaign';
import { httpClient } from '..';

export const createCampaignAction = async (payload: CreateCampaignPayload) => {
  const response = await httpClient.post<CreateCampaignResponse>(
    endpoints.campaigns.add,
    payload
  );
  return response.data;
};

export const deleteCampaignAction = async (id: number) => {
  const response = await httpClient.delete<DeleteCampaignResponse>(
    endpoints.campaigns.delete(id)
  );
  return response.data;
};

export const getCampaignsAction = async (options?: GetCampaignsOption) => {
  const response = await httpClient.get<GetCampaignsResponse>(
    endpoints.campaigns.getAll,
    {
      params: options,
    }
  );
  return response.data;
};

export const getCampaignAction = async (id: number) => {
  const response = await httpClient.get<GetCampaignResponse>(
    endpoints.campaigns.get(id)
  );
  return response.data;
};
