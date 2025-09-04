import { Container } from '@mui/material';
import { useGetCampaignQuery } from 'src/api/hooks/campaign';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import CampaignsNewEditForm from '../campaigns-new-edit-form';

export const CampaignEditView = () => {
  const { id } = useParams();
  const { data, isPending } = useGetCampaignQuery(Number(id));

  const campaign = data?.data;

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Campaigns',
            href: paths.dashboard.campaign.list,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isPending && <LoadingScreen />}
      {campaign && <CampaignsNewEditForm currentCampaign={campaign} />}
    </Container>
  );
};
