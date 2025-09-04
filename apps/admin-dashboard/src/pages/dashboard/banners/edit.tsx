import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { BannerEditView } from 'src/sections/banners/view';
// ----------------------------------------------------------------------

export default function BannerEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Banner Edit</title>
      </Helmet>

      <BannerEditView id={`${id}`} />
    </>
  );
}
