import { endpoints } from 'src/utils/axios';

import {
  CreateRolePayload,
  CreateRoleResponse,
  DeleteRoleResponse,
  GetRoleResponse,
  GetRolesListResponse,
  GetRolesOption,
  GetRolesResponse,
  UpdateRolePayload,
  UpdateRoleResponse,
} from '../types/roles';
import { httpClient } from '..';

export const getRolesAction = async (options?: GetRolesOption) => {
  const response = await httpClient.get<GetRolesResponse>(
    endpoints.roles.getAll,
    { params: options }
  );
  return response.data;
};

export const getRolesListAction = async () => {
  const response = await httpClient.get<GetRolesListResponse>(
    endpoints.roles.list
  );
  return response.data;
};

export const createRoleAction = async (payload: CreateRolePayload) => {
  const response = await httpClient.post<CreateRoleResponse>(
    endpoints.roles.add,
    payload
  );
  return response.data;
};

export const updateRoleAction = async (
  id: number,
  payload: UpdateRolePayload
) => {
  const response = await httpClient.put<UpdateRoleResponse>(
    endpoints.roles.update(id),
    payload
  );
  return response.data;
};

export const getRoleAction = async (id: number) => {
  const response = await httpClient.get<GetRoleResponse>(
    endpoints.roles.get(id)
  );
  return response.data;
};

export const deleteRoleAction = async (id: number) => {
  const response = await httpClient.delete<DeleteRoleResponse>(
    endpoints.roles.delete(id)
  );
  return response.data;
};
