import { STORAGE_KEY } from 'src/auth/context/jwt';

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  // return localStorage.getItem(STORAGE_KEY);
  // TODO: remove constant token
  return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6ImFsZXhzZWMiLCJGdWxsTmFtZSI6IkFsZXggU2VjZXJ0YXJ5IiwiUm9sZSI6IjIiLCJDaXJjbGVJZCI6IjBlNGM4ODE3LWZlNzEtNGZhYi1iYzk0LTc5M2E1MzhiZjg5NSIsIkNpcmNsZU5hbWUiOiLYr9in2KbYsdipINmE2YTYqtis2LHYqNipINix2YLZhSAyLTEiLCJDb3VydElkIjoiZmUzYzcyY2QtMjNjNy00NTk1LTgwN2MtOWZkZGMwMjJlMmRhIiwiQ291cnROYW1lIjoi2YXYrdmD2YXYqSDZhNmE2KrYrNix2KjYqSDYsdmC2YUgMSIsIkN1cnJlbnRVc2VySWQiOiI3NjI4MDdmYS0yN2RmLTRiMWQtOGEzMS05YTNhNGRkOGVjNWUiLCJuYmYiOjE3NTY5OTc2NzksImV4cCI6MTc1NzA4NDA3OSwiaWF0IjoxNzU2OTk3Njc5LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.i18JIZ3JgYuJcmIyBjQSQNjnG00nHm3mcRFCy1DgxX2Ub-xAlfjy-ebrYi5IhjWabW1dK8iHZCk2al0a3QHI1g';
};

export const removeToken = (): boolean => {
  const token = getToken();

  if (token) {
    localStorage.removeItem(STORAGE_KEY);
  }

  return !!token;
};
