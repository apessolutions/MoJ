import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';

import {
  AdminPermission,
  BannerPermission,
  CampaignPermission,
  RolePermission,
  UserPermission,
} from '../../../../libs/role/src/lib/types/permission-type.type';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const iconify = (name: string) => <Iconify icon={name} width={20} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  roles: iconify('icon-park-twotone:permissions'),
  services: iconify('hugeicons:service'),
  // TODO: Search for a better icon
  sessions: iconify('simple-icons:session'),
  transactions: iconify('streamline:payment-10'),
  cancel: iconify('material-symbols:cancel-outline'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Content',
    items: [
      {
        title: 'Banners',
        path: paths.dashboard.banner.list,
        icon: ICONS.label,
        permission: BannerPermission.LIST,
      },
      {
        title: 'Campaigns',
        path: paths.dashboard.campaign.list,
        icon: ICONS.order,
        permission: CampaignPermission.LIST,
      },
      {
        title: 'Users',
        path: paths.dashboard.user.list,
        icon: ICONS.user,
        permission: UserPermission.LIST,
      },
    ],
  },
  {
    subheader: 'Access control level',
    items: [
      {
        title: 'Roles',
        path: paths.dashboard.roles.list,
        icon: ICONS.roles,
        permission: RolePermission.LIST,
      },
      {
        title: 'Admins',
        path: paths.dashboard.admins.list,
        icon: ICONS.lock,
        permission: AdminPermission.LIST,
      },
    ],
  },
];
