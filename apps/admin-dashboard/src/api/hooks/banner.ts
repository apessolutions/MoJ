import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError } from 'src/types/response';

import {
  createBannerAction,
  deleteBannerAction,
  getBannerAction,
  getBannersAction,
  reorderBannerAction,
  toggleBannerStatusAction,
  updateBannerAction,
} from '../actions/banner';
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

export const useGetBannersQuery = () => {
  return useQuery<GetBannersResponse, ApiError>({
    queryKey: [QUERY_KEYS.BANNERS],
    queryFn: getBannersAction,
  });
};

export const useGetBannerQuery = (id: number) => {
  return useQuery<GetBannerResponse, ApiError>({
    queryKey: [QUERY_KEYS.BANNERS, id],
    queryFn: () => getBannerAction(id),
  });
};

export const useCreateBannerMutation = () => {
  const queyClient = useQueryClient();
  return useMutation<
    CreateBannerResponse,
    ApiError<CreateBannerPayload>,
    CreateBannerPayload
  >({
    mutationFn: createBannerAction,
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [QUERY_KEYS.BANNERS] });
    },
  });
};

export const useUpdateBannerMutation = (id: number) => {
  const queyClient = useQueryClient();

  return useMutation<
    UpdateBannerResponse,
    ApiError<UpdateBannerPayload>,
    UpdateBannerPayload
  >({
    mutationFn: (payload) => updateBannerAction(id, payload),
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [QUERY_KEYS.BANNERS] });
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queyClient = useQueryClient();

  return useMutation<DeleteBannerResponse, ApiError, number>({
    mutationFn: deleteBannerAction,
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [QUERY_KEYS.BANNERS] });
    },
  });
};

export const useToggleBannerStatusMutation = () => {
  const queyClient = useQueryClient();

  return useMutation<ToggleBannerStatusResponse, ApiError, number>({
    mutationFn: toggleBannerStatusAction,
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [QUERY_KEYS.BANNERS] });
    },
  });
};

export const useReorderBannerMutation = () => {
  const queyClient = useQueryClient();

  return useMutation<ReorderBannerResponse, ApiError, ReorderBannerPayload>({
    mutationFn: reorderBannerAction,
    onSuccess: () => {
      queyClient.invalidateQueries({ queryKey: [QUERY_KEYS.BANNERS] });
    },
  });
};
