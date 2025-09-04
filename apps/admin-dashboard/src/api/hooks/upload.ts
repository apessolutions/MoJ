import { useMutation } from '@tanstack/react-query';
import { ApiError } from 'src/types/response';

import { uploadFileAction, uploadFilesAction } from '../actions/upload';
import {
  UploadFilePayload,
  UploadFileResponse,
  UploadFilesPayload,
  UploadFilesResponse,
} from '../types/upload';

export const useUploadFileMutation = () => {
  return useMutation<UploadFileResponse, ApiError, UploadFilePayload>({
    mutationFn: uploadFileAction,
  });
};

export const useUploadFilesMutation = () => {
  return useMutation<UploadFilesResponse, ApiError, UploadFilesPayload>({
    mutationFn: uploadFilesAction,
  });
};
