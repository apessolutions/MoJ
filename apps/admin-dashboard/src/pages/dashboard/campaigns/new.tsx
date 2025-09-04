import { Helmet } from 'react-helmet-async';
import { CampaignCreateView } from 'src/sections/campaigns/view/campaign-create-view';

export default function CampaignCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Campaign</title>
      </Helmet>

      <CampaignCreateView />
    </>
  );
}
