export enum AdminPermission {
  ADD = 'admin.add',
  EDIT = 'admin.edit',
  LIST = 'admin.list',
  VIEW = 'admin.view',
  DELETE = 'admin.delete',
}

export enum RolePermission {
  ADD = 'role.add',
  EDIT = 'role.edit',
  LIST = 'role.list',
  VIEW = 'role.view',
  DELETE = 'role.delete',
}

export enum DashboardPermission {
  VIEW = 'dashboard.view',
  ALL_DAY_ACCESS = 'dashboard.allDaysAccess',
}

export enum UserPermission {
  ADD = 'user.add',
  EDIT = 'user.edit',
  LIST = 'user.list',
  VIEW = 'user.view',
  BLOCK = 'user.block',
}

export enum BannerPermission {
  ADD = 'banner.add',
  EDIT = 'banner.edit',
  LIST = 'banner.list',
  VIEW = 'banner.view',
  DELETE = 'banner.delete',
}

export enum CampaignPermission {
  ADD = 'campaign.add',
  LIST = 'campaign.list',
  VIEW = 'campaign.view',
  DELETE = 'campaign.delete',
}

export type PermissionType =
  | AdminPermission
  | RolePermission
  | DashboardPermission
  | UserPermission
  | BannerPermission
  | CampaignPermission;
