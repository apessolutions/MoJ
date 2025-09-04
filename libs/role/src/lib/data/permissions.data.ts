import {
  AdminPermission,
  BannerPermission,
  CampaignPermission,
  DashboardPermission,
  RolePermission,
  UserPermission,
} from '../types/permission-type.type';

export const permissions = [
  {
    label: 'Admin',
    name: 'admin',
    permissions: [
      { label: 'Add', name: AdminPermission.ADD },
      { label: 'Edit', name: AdminPermission.EDIT },
      { label: 'List', name: AdminPermission.LIST },
      { label: 'View', name: AdminPermission.VIEW },
      { label: 'Delete', name: AdminPermission.DELETE },
    ],
  },
  {
    label: 'Role',
    name: 'role',
    permissions: [
      { label: 'Add', name: RolePermission.ADD },
      { label: 'Edit', name: RolePermission.EDIT },
      { label: 'List', name: RolePermission.LIST },
      { label: 'View', name: RolePermission.VIEW },
      { label: 'Delete', name: RolePermission.DELETE },
    ],
  },
  {
    label: 'Dashboard',
    name: 'dashboard',
    permissions: [
      { label: 'View', name: DashboardPermission.VIEW },
      { label: 'All Days Access', name: DashboardPermission.ALL_DAY_ACCESS },
    ],
  },
  {
    label: 'User',
    name: 'user',
    permissions: [
      { label: 'List', name: UserPermission.LIST },
      { label: 'View', name: UserPermission.VIEW },
      { label: 'Block', name: UserPermission.BLOCK },
      { label: 'Edit', name: UserPermission.EDIT },
    ],
  },
  {
    label: 'Banner',
    name: 'banner',
    permissions: [
      { label: 'Add', name: BannerPermission.ADD },
      { label: 'Edit', name: BannerPermission.EDIT },
      { label: 'List', name: BannerPermission.LIST },
      { label: 'View', name: BannerPermission.VIEW },
      { label: 'Delete', name: BannerPermission.DELETE },
    ],
  },
  {
    label: 'Campaign',
    name: 'campaign',
    permissions: [
      { label: 'Add', name: CampaignPermission.ADD },
      { label: 'List', name: CampaignPermission.LIST },
      { label: 'View', name: CampaignPermission.VIEW },
      { label: 'Delete', name: CampaignPermission.DELETE },
    ],
  },
];

export type PermissionsDto = {
  id: number;
  name: string;
  permissions: {
    id: number;
    label: string;
    permission: string;
  }[];
};
