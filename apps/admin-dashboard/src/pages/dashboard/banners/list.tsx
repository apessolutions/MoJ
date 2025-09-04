import { Helmet } from 'react-helmet-async';

// sections
import { BannerListView } from 'src/sections/banners/view';

// ----------------------------------------------------------------------

export default function BannerListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Banner List</title>
      </Helmet>

      <BannerListView />
    </>
  );
}
