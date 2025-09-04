import { Container } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import CampaignsNewEditForm from '../campaigns-new-edit-form';

export const CampaignCreateView = () => {
  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Campaign"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Campaigns',
            href: paths.dashboard.campaign.list,
          },
          { name: 'New Campaign' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CampaignsNewEditForm />
    </Container>
  );
};
