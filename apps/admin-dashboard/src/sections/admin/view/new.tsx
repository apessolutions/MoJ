import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import AdminsNewEditForm from '../admin-new-edit-form';

// ----------------------------------------------------------------------

export default function AdminNewView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create New Admin"
        links={[
          {
            name: 'Admins',
            href: paths.dashboard.admins.list,
          },
          { name: 'New Admin' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <AdminsNewEditForm />
    </DashboardContent>
  );
}
