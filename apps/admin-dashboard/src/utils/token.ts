import { STORAGE_KEY } from 'src/auth/context/jwt';

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  // return localStorage.getItem(STORAGE_KEY);
  // TODO: remove constant token
  return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImpvaG5kb2UiLCJGdWxsTmFtZSI6IkpvaG4gRG9lIiwiUm9sZSI6IjIiLCJDaXJjbGVJZCI6IjEiLCJDaXJjbGVOYW1lIjoi2K_Yp9im2LHYqSDYrNiy2KbZiiIsIkNvdXJ0SWQiOiIxIiwiQ291cnROYW1lIjoiINmF2K3Zg9mF2Kkg2KfZhNmC2KfZh9ix2Kkg2KfZhNis2K_Zitiv2KkiLCJDdXJyZW50VXNlcklkIjoiMSIsIm5iZiI6MTc1NzY4MDIzMCwiZXhwIjoxNzU3NzY2NjMwLCJpYXQiOjE3NTc2ODAyMzAsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.5ghWj1A7zDD6LnPBv1iK-5SFUoAZY60u1jya85fyMVpy9SSbscpnCgOFE5IWyF5q2TGc6wwsZy96dhCCpfeQSQ';
};

export const removeToken = (): boolean => {
  const token = getToken();

  if (token) {
    localStorage.removeItem(STORAGE_KEY);
  }

  return !!token;
};
