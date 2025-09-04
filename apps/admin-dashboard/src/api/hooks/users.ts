import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';

import { getUserAction, getUsersAction } from '../actions/users';
import { GetUsersOption } from '../types/users';

export const useGetUsersQuery = (options?: GetUsersOption) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, options],
    queryFn: () => getUsersAction(options),
  });
};

export const useGetUserQuery = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, id],
    queryFn: () => getUserAction(id),
  });
};
