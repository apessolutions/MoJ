import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError } from 'src/types/response';

import {
  createAdminAction,
  deleteAdminAction,
  getAdminAction,
  getAdminsAction,
  getAdminsListAction,
  updateAdminAction,
} from '../actions/admins';
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

export const useGetAdminsQuery = (options?: GetAdminsOption) => {
  return useQuery<GetAdminsResponse, ApiError>({
    queryKey: [QUERY_KEYS.ADMINS, options],
    queryFn: () => getAdminsAction(options),
  });
};

export const useGetAdminsListQuery = () => {
  return useQuery<GetAdminsListResponse, ApiError>({
    queryKey: [QUERY_KEYS.ADMINS],
    queryFn: getAdminsListAction,
  });
};

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateAdminResponse,
    ApiError<CreateAdminPayload>,
    CreateAdminPayload
  >({
    mutationFn: createAdminAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
  });
};

export const useUpdateAdminMutation = (id?: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateAdminResponse,
    ApiError<UpdateAdminPayload>,
    UpdateAdminPayload
  >({
    mutationFn: (payload) => updateAdminAction(Number(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
  });
};

export const useGetAdminQuery = (id: number) => {
  return useQuery<GetAdminResponse, ApiError>({
    queryKey: [QUERY_KEYS.ADMINS, id],
    queryFn: () => getAdminAction(id),
  });
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteAdminResponse, ApiError, number>({
    mutationFn: (id) => deleteAdminAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });
    },
  });
};
