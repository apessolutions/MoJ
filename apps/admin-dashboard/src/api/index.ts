import axios from 'axios';
import { CONFIG } from 'src/config-global';
import { getApiError } from 'src/utils/helper';
import { getToken } from 'src/utils/token';

const httpClient = axios.create({
  baseURL: CONFIG.site.serverUrl,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const serverError = error?.response?.data;
    const apiError = getApiError(serverError);
    return Promise.reject(apiError);
  }
);

export { httpClient };
