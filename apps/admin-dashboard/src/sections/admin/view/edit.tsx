import { LinearProgress } from '@mui/material';
import { useParams } from 'react-router';
import { useGetAdminQuery } from 'src/api/hooks/admins';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';

import AdminsNewEditForm from '../admin-new-edit-form';

// ----------------------------------------------------------------------

export default function AdminEditView() {
  const { adminId } = useParams();
  const { data, isPending } = useGetAdminQuery(Number(adminId));

  const admin = data?.data;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Admin"
        links={[
          { name: 'Admins', href: paths.dashboard.admins.list },
          {
            name: admin?.firstName || 'Edit Admin',
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
        <AdminsNewEditForm currentAdmin={admin} />
      )}
    </DashboardContent>
  );
}
