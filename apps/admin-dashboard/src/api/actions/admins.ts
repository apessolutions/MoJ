import { endpoints } from 'src/utils/axios';

import {
  CreateAdminPayload,
  CreateAdminResponse,
  DeleteAdminResponse,
  GetAdminResponse,
  GetAdminsListResponse,
  GetAdminsOption,
  GetAdminsResponse,
  UpdateAdminPayload,
  UpdateAdminResponse,
} from '../types/admins';
import { httpClient } from '..';

export const getAdminsAction = async (options?: GetAdminsOption) => {
  const response = await httpClient.get<GetAdminsResponse>(
    endpoints.admin.getAll,
    { params: options }
  );
  return response.data;
};

export const getAdminsListAction = async () => {
  const response = await httpClient.get<GetAdminsListResponse>(
    endpoints.admin.list
  );
  return response.data;
};

export const createAdminAction = async (payload: CreateAdminPayload) => {
  const response = await httpClient.post<CreateAdminResponse>(
    endpoints.admin.add,
    payload
  );
  return response.data;
};

export const updateAdminAction = async (
  id: number,
  payload: UpdateAdminPayload
) => {
  const response = await httpClient.patch<UpdateAdminResponse>(
    endpoints.admin.update(id),
    payload
  );
  return response.data;
};

export const getAdminAction = async (id: number) => {
  const response = await httpClient.get<GetAdminResponse>(
    endpoints.admin.get(id)
  );
  return response.data;
};

export const deleteAdminAction = async (id: number) => {
  const response = await httpClient.delete<DeleteAdminResponse>(
    endpoints.admin.delete(id)
  );
  return response.data;
};
