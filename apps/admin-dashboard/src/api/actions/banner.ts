import { endpoints } from 'src/utils/axios';

import {
  CreateBannerPayload,
  CreateBannerResponse,
  DeleteBannerResponse,
  GetBannerResponse,
  GetBannersResponse,
  ReorderBannerPayload,
  ReorderBannerResponse,
  ToggleBannerStatusResponse,
  UpdateBannerPayload,
  UpdateBannerResponse,
} from '../types/banner';
import { httpClient } from '..';

export const createBannerAction = async (payload: CreateBannerPayload) => {
  const response = await httpClient.post<CreateBannerResponse>(
    endpoints.banner.add,
    payload
  );

  return response.data;
};
export const updateBannerAction = async (
  id: number,
  payload: UpdateBannerPayload
) => {
  const response = await httpClient.put<UpdateBannerResponse>(
    endpoints.banner.update(id),
    payload
  );

  return response.data;
};
export const deleteBannerAction = async (id: number) => {
  const response = await httpClient.delete<DeleteBannerResponse>(
    endpoints.banner.delete(id)
  );

  return response.data;
};
export const getBannerAction = async (id: number) => {
  const response = await httpClient.get<GetBannerResponse>(
    endpoints.banner.get(id)
  );

  return response.data;
};
export const getBannersAction = async () => {
  const response = await httpClient.get<GetBannersResponse>(
    endpoints.banner.getAll
  );

  return response.data;
};
export const toggleBannerStatusAction = async (id: number) => {
  const response = await httpClient.put<ToggleBannerStatusResponse>(
    endpoints.banner.toggleStatus(id)
  );

  return response.data;
};

export const reorderBannerAction = async (payload: ReorderBannerPayload) => {
  const response = await httpClient.patch<ReorderBannerResponse>(
    endpoints.banner.reorder,
    payload
  );

  return response.data;
};
