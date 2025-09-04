import { STORAGE_KEY } from 'src/auth/context/jwt';

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const removeToken = (): boolean => {
  const token = getToken();

  if (token) {
    localStorage.removeItem(STORAGE_KEY);
  }

  return !!token;
};
