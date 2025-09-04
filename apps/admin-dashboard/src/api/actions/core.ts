import { endpoints } from 'src/utils/axios';

import { GetPermissionsListResponse } from '../types/core';
import { httpClient } from '..';

export const getPermissionsListAction = async () => {
  const response = await httpClient.get<GetPermissionsListResponse>(
    endpoints.core.permissions
  );
  return response.data;
};
