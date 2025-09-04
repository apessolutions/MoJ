import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError } from 'src/types/response';

import {
  createRoleAction,
  deleteRoleAction,
  getRoleAction,
  getRolesAction,
  getRolesListAction,
  updateRoleAction,
} from '../actions/roles';
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

export const useGetRolesQuery = (options?: GetRolesOption) => {
  return useQuery<GetRolesResponse, ApiError>({
    queryKey: [QUERY_KEYS.ROLES, options],
    queryFn: () => getRolesAction(options),
  });
};

export const useGetRolesListQuery = () => {
  return useQuery<GetRolesListResponse, ApiError>({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: getRolesListAction,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateRoleResponse,
    ApiError<CreateRolePayload>,
    CreateRolePayload
  >({
    mutationFn: createRoleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
    },
  });
};

export const useUpdateRoleMutation = (id?: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateRoleResponse,
    ApiError<UpdateRolePayload>,
    UpdateRolePayload
  >({
    mutationFn: (payload) => updateRoleAction(Number(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
    },
  });
};

export const useGetRoleQuery = (id: number) => {
  return useQuery<GetRoleResponse, ApiError>({
    queryKey: [QUERY_KEYS.ROLES, id],
    queryFn: () => getRoleAction(id),
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteRoleResponse, ApiError, number>({
    mutationFn: (id) => deleteRoleAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] });
    },
  });
};
