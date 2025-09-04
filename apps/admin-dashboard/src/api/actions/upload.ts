import { endpoints } from 'src/utils/axios';

import {
  UploadFilePayload,
  UploadFileResponse,
  UploadFilesPayload,
  UploadFilesResponse,
} from '../types/upload';
import { httpClient } from '..';

export const uploadFileAction = async (payload: UploadFilePayload) => {
  const formData = new FormData();
  formData.append('file', payload);
  const response = await httpClient.post<UploadFileResponse>(
    endpoints.upload.file,
    formData
  );

  return response.data;
};

export const uploadFilesAction = async (payload: UploadFilesPayload) => {
  const formData = new FormData();
  payload.forEach((file) => {
    formData.append('files', file);
  });
  const response = await httpClient.post<UploadFilesResponse>(
    endpoints.upload.files,
    formData
  );

  return response.data;
};
