import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from 'src/auth/guard';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { LoadingScreen } from 'src/components/loading-screen';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import {
  AdminPermission,
  BannerPermission,
  CampaignPermission,
  RolePermission,
  UserPermission,
} from '../../../../../libs/role/src/lib/types/permission-type.type';

// ----------------------------------------------------------------------
// Here will be the dashboard statistics page
const IndexPage = () => <div />;
// ----------------------------------------------------------------------

const RolesPage = lazy(() => import('src/pages/dashboard/roles/list'));
const RolesEdit = lazy(() => import('src/pages/dashboard/roles/edit'));
const RolesNew = lazy(() => import('src/pages/dashboard/roles/new'));
// ----------------------------------------------------------------------
const AdminsList = lazy(() => import('src/pages/dashboard/admin/list'));
const AdminsNew = lazy(() => import('src/pages/dashboard/admin/new'));
const AdminsEdit = lazy(() => import('src/pages/dashboard/admin/edit'));
const AdminsAccount = lazy(() => import('src/pages/dashboard/admin/account'));

// ----------------------------------------------------------------------
const BannersListPage = lazy(() => import('src/pages/dashboard/banners/list'));
const BannersCreatePage = lazy(() => import('src/pages/dashboard/banners/new'));
const BannersEditPage = lazy(() => import('src/pages/dashboard/banners/edit'));
// ----------------------------------------------------------------------
const UsersListPage = lazy(() => import('src/pages/dashboard/users/list'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/users/profile'));
// ----------------------------------------------------------------------
const CampaignsListPage = lazy(
  () => import('src/pages/dashboard/campaigns/list')
);
const CampaignsCreatePage = lazy(
  () => import('src/pages/dashboard/campaigns/new')
);

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? (
      layoutContent
    ) : (
      <AuthGuard>{layoutContent}</AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'profile',
        element: (
          <PermissionGuard requiredPermission={AdminPermission.EDIT} isPage>
            <AdminsAccount />,
          </PermissionGuard>
        ),
      },
      {
        path: 'roles',
        children: [
          {
            index: true,
            element: (
              <PermissionGuard requiredPermission={RolePermission.LIST} isPage>
                <RolesPage />
              </PermissionGuard>
            ),
          },
          {
            path: ':roleId/edit',
            element: (
              <PermissionGuard requiredPermission={RolePermission.EDIT} isPage>
                <RolesEdit />
              </PermissionGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionGuard requiredPermission={RolePermission.ADD} isPage>
                <RolesNew />
              </PermissionGuard>
            ),
          },
        ],
      },
      {
        path: 'admins',
        children: [
          {
            index: true,
            element: (
              <PermissionGuard requiredPermission={AdminPermission.LIST} isPage>
                <AdminsList />
              </PermissionGuard>
            ),
          },
          {
            path: ':adminId/edit',
            element: (
              <PermissionGuard requiredPermission={AdminPermission.EDIT} isPage>
                <AdminsEdit />
              </PermissionGuard>
            ),
          },
          {
            path: 'new',
            element: (
              <PermissionGuard requiredPermission={AdminPermission.ADD} isPage>
                <AdminsNew />
              </PermissionGuard>
            ),
          },
        ],
      },
      {
        path: 'banners',
        children: [
          {
            element: (
              <PermissionGuard
                requiredPermission={BannerPermission.LIST}
                isPage
              >
                <BannersListPage />
              </PermissionGuard>
            ),
            index: true,
          },
          {
            path: 'new',
            element: (
              <PermissionGuard requiredPermission={BannerPermission.ADD} isPage>
                <BannersCreatePage />
              </PermissionGuard>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <PermissionGuard
                requiredPermission={BannerPermission.EDIT}
                isPage
              >
                <BannersEditPage />
              </PermissionGuard>
            ),
          },
        ],
      },
      {
        path: 'campaigns',
        children: [
          {
            element: (
              <PermissionGuard
                requiredPermission={CampaignPermission.LIST}
                isPage
              >
                <CampaignsListPage />
              </PermissionGuard>
            ),

            index: true,
          },
          {
            path: 'new',
            element: (
              <PermissionGuard
                requiredPermission={CampaignPermission.ADD}
                isPage
              >
                <CampaignsCreatePage />
              </PermissionGuard>
            ),
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            element: (
              <PermissionGuard requiredPermission={UserPermission.LIST} isPage>
                <UsersListPage />
              </PermissionGuard>
            ),

            index: true,
          },
          {
            path: ':id/profile',
            element: (
              <PermissionGuard requiredPermission={UserPermission.VIEW} isPage>
                <UserProfilePage />
              </PermissionGuard>
            ),
          },
        ],
      },
    ],
  },
];
