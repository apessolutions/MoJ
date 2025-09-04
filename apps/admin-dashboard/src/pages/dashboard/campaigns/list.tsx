import { Helmet } from 'react-helmet-async';
import { CampaignListView } from 'src/sections/campaigns/view/campaign-list-view';

// ----------------------------------------------------------------------

export default function CampaignListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Campaign List</title>
      </Helmet>

      <CampaignListView />
    </>
  );
}
