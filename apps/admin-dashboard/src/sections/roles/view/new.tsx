// routes
// components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import RoleNewEditForm from '../role-new-edit-form';

// ----------------------------------------------------------------------

export default function RolesNewView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Role"
        links={[
          {
            name: 'Roles',
            href: paths.dashboard.roles.list,
          },
          { name: 'New Role' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RoleNewEditForm />
    </DashboardContent>
  );
}
