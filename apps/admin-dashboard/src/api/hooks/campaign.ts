import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'src/constants/query-keys';
import { ApiError, ApiResponse } from 'src/types/response';

import {
  createCampaignAction,
  deleteCampaignAction,
  getCampaignAction,
  getCampaignsAction,
} from '../actions/campaign';
import {
  CreateCampaignPayload,
  CreateCampaignResponse,
  DeleteCampaignResponse,
  GetCampaignResponse,
  GetCampaignsOption,
  GetCampaignsResponse,
} from '../types/campaign';

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateCampaignResponse,
    ApiResponse<CreateCampaignPayload>,
    CreateCampaignPayload
  >({
    mutationFn: createCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS] });
    },
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCampaignResponse, ApiError, number>({
    mutationFn: deleteCampaignAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGNS] });
    },
  });
};

export const useGetCampaignsQuery = (options?: GetCampaignsOption) => {
  return useQuery<GetCampaignsResponse, ApiError>({
    queryKey: [QUERY_KEYS.CAMPAIGNS, options],
    queryFn: () => getCampaignsAction(options),
  });
};

export const useGetCampaignQuery = (id: number) => {
  return useQuery<GetCampaignResponse, ApiError>({
    queryKey: [QUERY_KEYS.CAMPAIGNS, id],
    queryFn: () => getCampaignAction(id),
  });
};
