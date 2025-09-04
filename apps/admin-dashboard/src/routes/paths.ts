// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      forgetPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    profile: `${ROOTS.DASHBOARD}/profile`,
    roles: {
      list: `${ROOTS.DASHBOARD}/roles`,
      new: `${ROOTS.DASHBOARD}/roles/new`,
      edit: (roleId: number) => `${ROOTS.DASHBOARD}/roles/${roleId}/edit`,
    },
    admins: {
      list: `${ROOTS.DASHBOARD}/admins`,
      new: `${ROOTS.DASHBOARD}/admins/new`,
      edit: (adminId: number) => `${ROOTS.DASHBOARD}/admins/${adminId}/edit`,
    },
    banner: {
      list: `${ROOTS.DASHBOARD}/banners`,
      new: `${ROOTS.DASHBOARD}/banners/new`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/banners/${id}/edit`,
    },
    campaign: {
      list: `${ROOTS.DASHBOARD}/campaigns`,
      new: `${ROOTS.DASHBOARD}/campaigns/new`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/campaigns/${id}/edit`,
    },
    user: {
      list: `${ROOTS.DASHBOARD}/users`,
      profile: (userId: number) => `${ROOTS.DASHBOARD}/users/${userId}/profile`,
    },
    transcriptDemo: `${ROOTS.DASHBOARD}/transcript-demo`,
  },
};
