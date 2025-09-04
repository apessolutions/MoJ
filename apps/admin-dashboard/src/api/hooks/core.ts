import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError } from 'src/types/response';

import { getPermissionsListAction } from '../actions/core';
import { GetPermissionsListResponse } from '../types/core';

export const useGetPermissionsListQuery = () => {
  return useQuery<GetPermissionsListResponse, ApiError>({
    queryKey: [QUERY_KEYS.PERMISSIONS],
    queryFn: getPermissionsListAction,
  });
};
