import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetUserQuery } from 'src/api/hooks/users';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { UserProfile } from '../user-profile';

export default function UserProfileView() {
  const { id } = useParams();
  const { data, isPending, isError } = useGetUserQuery(Number(id));

  const title = useMemo(() => {
    if (data?.data) {
      return `${data?.data?.firstName || ''} ${data?.data?.lastName || ''}`;
    }
    return 'User Profile';
  }, [data]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Users', href: paths.dashboard.user.list },
          {
            name: title,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Helmet>
        <title>{`Dashboard: ${title}`}</title>
      </Helmet>
      {isPending && <LoadingScreen />}
      {data && <UserProfile user={data.data} />}
      {isError && <EmptyContent title="User not found" />}
    </DashboardContent>
  );
}
