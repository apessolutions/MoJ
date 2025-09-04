import { endpoints } from 'src/utils/axios';

import {
  GetUserResponse,
  GetUsersOption,
  GetUsersResponse,
} from '../types/users';
import { httpClient } from '..';

export const getUsersAction = async (options?: GetUsersOption) => {
  const response = await httpClient.get<GetUsersResponse>(
    endpoints.users.getAll,
    { params: options }
  );
  return response.data;
};

export const getUserAction = async (id: number) => {
  const response = await httpClient.get<GetUserResponse>(
    endpoints.users.get(id)
  );
  return response.data;
};
