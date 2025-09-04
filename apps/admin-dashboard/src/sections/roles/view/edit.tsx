import { LinearProgress } from '@mui/material';
import { useGetRoleQuery } from 'src/api/hooks/roles';
// components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
// hooks
import { useParams } from 'src/routes/hooks';
// routes
import { paths } from 'src/routes/paths';

import RoleNewEditForm from '../role-new-edit-form';

// ----------------------------------------------------------------------

export default function RolesEditView() {
  const { roleId } = useParams();
  const { data, isPending } = useGetRoleQuery(Number(roleId));

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Role"
        links={[
          { name: 'Roles', href: paths.dashboard.roles.list },
          {
            name: data?.data?.title || 'Edit Role',
            href: paths.dashboard.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {isPending ? (
        <LinearProgress />
      ) : (
        <RoleNewEditForm currentRole={data?.data} />
      )}
    </DashboardContent>
  );
}
