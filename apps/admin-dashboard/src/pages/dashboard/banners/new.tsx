import { Helmet } from 'react-helmet-async';
// sections
import { BannerCreateView } from 'src/sections/banners/view';

// ----------------------------------------------------------------------

export default function BannerCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Banner</title>
      </Helmet>

      <BannerCreateView />
    </>
  );
}
