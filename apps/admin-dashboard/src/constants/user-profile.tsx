import { Iconify } from 'src/components/iconify';

export const USER_PROFILE_TABS = [
  { value: 'profile', label: 'Profile', icon: <Iconify icon="iconamoon:profile" width={24} /> },
] as const;
export type UserProfileTab = (typeof USER_PROFILE_TABS)[number]['value'];
