export function getServerError<T>(
  error: {
    message: string;
    errors: { [P in keyof T]?: string };
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setError: Function
) {
  const keys = Object.keys(error.errors);
  if (keys.length > 0) {
    keys.forEach((key) => {
      setError(key as keyof T, {
        type: 'server',
        message: error.errors[key as keyof T] ?? '',
      });
    });
  }
  return error.message;
}

// ----------------------------------------------------------------------

export const endpoints = {
  password: {
    forget: 'api/v1/auth/forget-password',
    verify: 'api/v1/auth/verify-password',
    reset: 'api/v1/auth/reset-password',
  },
  core: {
    permissions: 'api/v1/core/permissions',
  },
  auth: {
    me: 'api/v1/auth/me',
    signIn: 'api/v1/auth/login',
    changePassword: 'api/v1/password/change',
    updateAuthUser: 'api/v1/auth/profile',
  },
  roles: {
    add: 'api/v1/roles',
    list: 'api/v1/roles/list',
    getAll: 'api/v1/roles',
    get: (id: number) => `api/v1/roles/${id}`,
    delete: (id: number) => `api/v1/roles/${id}`,
    update: (id: number) => `api/v1/roles/${id}`,
    permissions: 'api/v1/roles/permissions',
  },
  admin: {
    add: 'api/v1/admins',
    list: 'api/v1/admins',
    getAll: 'api/v1/admins',
    get: (id: number) => `api/v1/admins/${id}`,
    delete: (id: number) => `api/v1/admins/${id}`,
    update: (id: number) => `api/v1/admins/${id}`,
  },
  banner: {
    add: 'api/v1/banners',
    list: 'api/v1/banners',
    getAll: 'api/v1/banners',
    get: (id: number) => `api/v1/banners/${id}`,
    delete: (id: number) => `api/v1/banners/${id}`,
    update: (id: number) => `api/v1/banners/${id}`,
    toggleStatus: (id: number) => `api/v1/banners/${id}/toggle-status`,
    reorder: 'api/v1/banners/reorder',
  },
  upload: {
    file: 'api/v1/files/upload',
    files: 'api/v1/files/upload-files',
  },
  campaigns: {
    add: 'api/v1/campaigns',
    getAll: 'api/v1/campaigns',
    get: (id: number) => `api/v1/campaigns/${id}`,
    delete: (id: number) => `api/v1/campaigns/${id}`,
  },
  users: {
    getAll: 'api/v1/users',
    get: (id: number) => `api/v1/users/${id}`,
  },
} as const;
