import Container from '@mui/material/Container';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import BannersNewEditForm from '../banner-new-edit-form';

// ----------------------------------------------------------------------

export default function BannerCreateView() {
  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Banner"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Banners',
            href: paths.dashboard.banner.list,
          },
          { name: 'New Banner' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BannersNewEditForm />
    </Container>
  );
}
